const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const app = express();

const PORT = 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "super_secret_key_change_this",

    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/* =========================================================
   MYSQL
========================================================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "trading_app",
});

const sql = db.promise();

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }

  console.log("==========================================");
  console.log(" Connected to XAMPP MySQL");
  console.log(" Database: trading_app");
  console.log("==========================================");
});

/* =========================================================
   HELPERS
========================================================= */

function sendServerError(res, message, error) {
  console.error(message, error);

  return res.status(500).json({
    success: false,
    error: message,
  });
}

function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : NaN;
}

function normalizeAccountMode(value) {
  const mode = String(value || "")
    .trim()
    .toLowerCase();

  return mode === "real" ? "real" : "demo";
}

function getBalanceColumn(accountMode) {
  return accountMode === "real"
    ? "real_balance"
    : "demo_balance";
}

function getAccountLabel(accountMode) {
  return accountMode === "real"
    ? "Real Account"
    : "Demo Account";
}

/* =========================================================
   WALLET HELPERS
========================================================= */

async function ensureWallet(userId) {
  const [rows] = await sql.query(
    `
      SELECT
        id,
        user_id,
        demo_balance,
        real_balance
      FROM wallets
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  const [result] = await sql.query(
    `
      INSERT INTO wallets
      (
        user_id,
        demo_balance,
        real_balance
      )
      VALUES (?, 100000.00, 0.00)
    `,
    [userId]
  );

  return {
    id: result.insertId,
    user_id: userId,
    demo_balance: 100000,
    real_balance: 0,
  };
}

async function getUserWallet(userId) {
  await ensureWallet(userId);

  const [rows] = await sql.query(
    `
      SELECT
        id,
        user_id,
        demo_balance,
        real_balance
      FROM wallets
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}

function getCurrentAccountMode(req) {
  return normalizeAccountMode(
    req.session.accountMode || "demo"
  );
}

function setAccountMode(req, accountMode) {
  req.session.accountMode =
    normalizeAccountMode(accountMode);
}

/* =========================================================
   AUTHENTICATION
========================================================= */

function requireTrader(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in.",
    });
  }

  if (req.session.role !== "trader") {
    return res.status(403).json({
      success: false,
      error: "Trader access required.",
    });
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in.",
    });
  }

  if (req.session.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin required.",
    });
  }

  next();
}

/* =========================================================
   1. REGISTER TRADER
========================================================= */

app.post("/api/register", async (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  const cleanName = String(name).trim();

  const cleanEmail = String(email)
    .trim()
    .toLowerCase();

  if (cleanName.length < 2) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid name.",
    });
  }

  if (cleanEmail.length < 5) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid email address.",
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const [result] = await sql.query(
      `
        INSERT INTO users
        (
          name,
          email,
          password,
          role
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        "trader",
      ]
    );

    const userId = result.insertId;

    await sql.query(
      `
        INSERT INTO wallets
        (
          user_id,
          demo_balance,
          real_balance
        )
        VALUES (?, 100000.00, 0.00)
      `,
      [userId]
    );

    return res.status(201).json({
      success: true,

      message:
        "Trader account registered successfully.",

      userId,
      name: cleanName,
      email: cleanEmail,
      role: "trader",

      accountMode: "demo",

      accounts: {
        demoBalance: 100000,
        realBalance: 0,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error:
          "An account with this email already exists.",
      });
    }

    return sendServerError(
      res,
      "Server error during registration.",
      error
    );
  }
});

/* =========================================================
   2. ADMIN REGISTRATION
========================================================= */

app.post(
  "/api/admin/register",
  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const cleanName = String(name).trim();

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error:
          "Password must be at least 6 characters.",
      });
    }

    try {
      const hashedPassword =
        await bcrypt.hash(password, 10);

      const [result] = await sql.query(
        `
          INSERT INTO admins
          (
            name,
            email,
            password
          )
          VALUES (?, ?, ?)
        `,
        [
          cleanName,
          cleanEmail,
          hashedPassword,
        ]
      );

      return res.status(201).json({
        success: true,

        message:
          "Admin account registered successfully.",

        adminId: result.insertId,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          error: "Admin email already exists.",
        });
      }

      return sendServerError(
        res,
        "Server error.",
        error
      );
    }
  }
);

/* =========================================================
   3. LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error:
        "Email and password are required.",
    });
  }

  const cleanEmail = String(email)
    .trim()
    .toLowerCase();

  try {
    /* -----------------------------------------
       CHECK ADMIN
    ----------------------------------------- */

    const [admins] = await sql.query(
      `
        SELECT
          id,
          name,
          email,
          password
        FROM admins
        WHERE email = ?
        LIMIT 1
      `,
      [cleanEmail]
    );

    if (admins.length > 0) {
      const admin = admins[0];

      const passwordMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error:
            "Invalid email or password.",
        });
      }

      req.session.userId = admin.id;
      req.session.role = "admin";
      req.session.name = admin.name;

      return req.session.save(
        (sessionError) => {
          if (sessionError) {
            return sendServerError(
              res,
              "Could not create login session.",
              sessionError
            );
          }

          return res.json({
            success: true,

            message:
              "Admin login successful.",

            role: "admin",
            userId: admin.id,
            name: admin.name,
          });
        }
      );
    }

    /* -----------------------------------------
       CHECK TRADER
    ----------------------------------------- */

    const [users] = await sql.query(
      `
        SELECT
          id,
          name,
          email,
          password,
          role
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error:
          "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error:
          "Invalid email or password.",
      });
    }

    if (user.role !== "trader") {
      return res.status(403).json({
        success: false,
        error:
          "This account does not have trader access.",
      });
    }

    await ensureWallet(user.id);

    /*
     * Start every login in DEMO mode.
     */
    req.session.userId = user.id;
    req.session.role = "trader";
    req.session.name = user.name;
    req.session.accountMode = "demo";

    return req.session.save(
      (sessionError) => {
        if (sessionError) {
          return sendServerError(
            res,
            "Could not create login session.",
            sessionError
          );
        }

        return res.json({
          success: true,

          message: "Login successful.",

          role: "trader",

          userId: user.id,

          name: user.name,

          accountMode: "demo",

          accountLabel:
            "Demo Account",

          isSimulated: true,
        });
      }
    );
  } catch (error) {
    return sendServerError(
      res,
      "Database error during login.",
      error
    );
  }
});

/* =========================================================
   4. LOGOUT
========================================================= */

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return sendServerError(
        res,
        "Could not log out.",
        err
      );
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  });
});

/* =========================================================
   5. GET CURRENT ACCOUNT MODE
========================================================= */

app.get(
  "/api/account/mode",
  requireTrader,
  async (req, res) => {
    try {
      const userId =
        req.session.userId;

      const accountMode =
        getCurrentAccountMode(req);

      const wallet =
        await getUserWallet(userId);

      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: "Wallet not found.",
        });
      }

      const demoBalance =
        Number(
          wallet.demo_balance || 0
        );

      const realBalance =
        Number(
          wallet.real_balance || 0
        );

      const balance =
        accountMode === "real"
          ? realBalance
          : demoBalance;

      return res.json({
        success: true,

        userId,

        accountMode,

        selectedAccountMode:
          accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        isSimulated: true,

        balance,

        demoBalance,

        realBalance,

        balances: {
          demo: demoBalance,
          real: realBalance,
        },
      });
    } catch (error) {
      return sendServerError(
        res,
        "Could not load account mode.",
        error
      );
    }
  }
);

/* =========================================================
   6. SWITCH DEMO / REAL ACCOUNT
========================================================= */

app.post(
  "/api/account/switch",
  requireTrader,
  async (req, res) => {
    const accountMode =
      normalizeAccountMode(
        req.body.accountMode
      );

    try {
      const userId =
        req.session.userId;

      const wallet =
        await getUserWallet(userId);

      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: "Wallet not found.",
        });
      }

      /*
       * Save account mode in session.
       */
      setAccountMode(
        req,
        accountMode
      );

      const demoBalance =
        Number(
          wallet.demo_balance || 0
        );

      const realBalance =
        Number(
          wallet.real_balance || 0
        );

      const balance =
        accountMode === "real"
          ? realBalance
          : demoBalance;

      /*
       * IMPORTANT:
       * Save the session before responding.
       */
      return req.session.save(
        (sessionError) => {
          if (sessionError) {
            return sendServerError(
              res,
              "Could not save account selection.",
              sessionError
            );
          }

          return res.json({
            success: true,

            message:
              `Switched to ${getAccountLabel(
                accountMode
              )}.`,

            userId,

            accountMode,

            selectedAccountMode:
              accountMode,

            accountLabel:
              getAccountLabel(
                accountMode
              ),

            isSimulated: true,

            balance,

            demoBalance,

            realBalance,

            balances: {
              demo: demoBalance,
              real: realBalance,
            },
          });
        }
      );
    } catch (error) {
      return sendServerError(
        res,
        "Could not switch account.",
        error
      );
    }
  }
);

/* =========================================================
   7. DASHBOARD
========================================================= */

app.get(
  "/api/dashboard",
  requireTrader,
  async (req, res) => {
    try {
      const userId =
        req.session.userId;

      const accountMode =
        getCurrentAccountMode(req);

      const wallet =
        await getUserWallet(userId);

      if (!wallet) {
        return res.status(404).json({
          success: false,
          error: "Wallet not found.",
        });
      }

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const demoBalance =
        Number(
          wallet.demo_balance || 0
        );

      const realBalance =
        Number(
          wallet.real_balance || 0
        );

      const balance =
        Number(
          wallet[balanceColumn] || 0
        );

      const [
        activeRows,
      ] = await sql.query(
        `
          SELECT
            COUNT(*) AS count,
            COALESCE(
              SUM(stake),
              0
            ) AS stake
          FROM trades
          WHERE user_id = ?
          AND account_mode = ?
          AND status = 'ACTIVE'
        `,
        [
          userId,
          accountMode,
        ]
      );

      const [
        settledRows,
      ] = await sql.query(
        `
          SELECT
            COUNT(*) AS count,
            COALESCE(
              SUM(profit),
              0
            ) AS profit
          FROM trades
          WHERE user_id = ?
          AND account_mode = ?
          AND status = 'SETTLED'
        `,
        [
          userId,
          accountMode,
        ]
      );

      const [
        winsRows,
      ] = await sql.query(
        `
          SELECT
            COUNT(*) AS count
          FROM trades
          WHERE user_id = ?
          AND account_mode = ?
          AND status = 'SETTLED'
          AND result = 'WON'
        `,
        [
          userId,
          accountMode,
        ]
      );

      const [
        todayRows,
      ] = await sql.query(
        `
          SELECT
            COALESCE(
              SUM(profit),
              0
            ) AS today_profit
          FROM trades
          WHERE user_id = ?
          AND account_mode = ?
          AND status = 'SETTLED'
          AND DATE(settled_at) = CURDATE()
        `,
        [
          userId,
          accountMode,
        ]
      );

      const [
        pendingWithdrawalRows,
      ] = await sql.query(
        `
          SELECT
            COALESCE(
              SUM(amount),
              0
            ) AS pending
          FROM withdrawals
          WHERE user_id = ?
          AND account_mode = ?
          AND status = 'pending'
        `,
        [
          userId,
          accountMode,
        ]
      );

      const activeCount =
        Number(
          activeRows[0]?.count || 0
        );

      const activeStake =
        Number(
          activeRows[0]?.stake || 0
        );

      const totalProfit =
        Number(
          settledRows[0]?.profit || 0
        );

      const wins =
        Number(
          winsRows[0]?.count || 0
        );

      const settledCount =
        Number(
          settledRows[0]?.count || 0
        );

      const todayProfit =
        Number(
          todayRows[0]?.today_profit || 0
        );

      const pendingWithdrawals =
        Number(
          pendingWithdrawalRows[0]
            ?.pending || 0
        );

      const winRate =
        settledCount > 0
          ? (wins / settledCount) * 100
          : 0;

      const equity =
        balance + activeStake;

      const freeMargin =
        balance;

      const roi =
        balance > 0
          ? (totalProfit / balance) * 100
          : 0;

      return res.json({
        success: true,

        message:
          `Welcome to your dashboard, ${req.session.name}!`,

        userId,

        name:
          req.session.name,

        role:
          req.session.role,

        accountMode,

        selectedAccountMode:
          accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        isSimulated: true,

        balance,

        demoBalance,

        realBalance,

        balances: {
          demo: demoBalance,
          real: realBalance,
        },

        wallet: {
          balance,

          demoBalance,

          realBalance,

          equity,

          freeMargin,

          pendingWithdrawals,
        },

        stats: {
          accountBalance:
            balance,

          equity,

          freeMargin,

          todayPL:
            todayProfit,

          openOrders:
            activeCount,

          winRate,

          roi,

          availableFunds:
            balance,

          pendingWithdrawals,
        },
      });
    } catch (error) {
      return sendServerError(
        res,
        "Could not load dashboard.",
        error
      );
    }
  }
);

/* =========================================================
   8. USER PROFILE
========================================================= */

app.get(
  "/api/user/profile",
  requireTrader,
  async (req, res) => {
    try {
      const [
        results,
      ] = await sql.query(
        `
          SELECT
            id,
            name,
            email,
            role,
            created_at
          FROM users
          WHERE id = ?
          LIMIT 1
        `,
        [req.session.userId]
      );

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error:
            "User account not found.",
        });
      }

      return res.json({
        success: true,

        ...results[0],

        accountMode:
          getCurrentAccountMode(req),

        isSimulated: true,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Database error.",
        error
      );
    }
  }
);

/* =========================================================
   9. USER BALANCE
========================================================= */

app.get(
  "/api/user/balance",
  requireTrader,
  async (req, res) => {
    try {
      const userId =
        req.session.userId;

      const wallet =
        await getUserWallet(userId);

      if (!wallet) {
        return res.status(404).json({
          success: false,
          error:
            "Wallet not found.",
        });
      }

      const accountMode =
        getCurrentAccountMode(req);

      const demoBalance =
        Number(
          wallet.demo_balance || 0
        );

      const realBalance =
        Number(
          wallet.real_balance || 0
        );

      const balance =
        accountMode === "real"
          ? realBalance
          : demoBalance;

      /*
       * IMPORTANT:
       *
       * This endpoint now ALWAYS returns:
       *
       * balance
       * demoBalance
       * realBalance
       * balances.demo
       * balances.real
       *
       * Therefore TradingChart.tsx can read
       * the REAL balance correctly.
       */

      return res.json({
        success: true,

        userId,

        accountMode,

        selectedAccountMode:
          accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        isSimulated: true,

        balance,

        demoBalance,

        realBalance,

        balances: {
          demo: demoBalance,
          real: realBalance,
        },
      });
    } catch (error) {
      return sendServerError(
        res,
        "Could not load wallet balance.",
        error
      );
    }
  }
);

/* =========================================================
   10. DEPOSIT
========================================================= */

app.post(
  "/api/deposits",
  requireTrader,
  async (req, res) => {
    try {
      const userId =
        req.session.userId;

      const accountMode =
        getCurrentAccountMode(req);

      const {
        amount,
        currency = "USD",
        method,
        transaction_reference,
        reference,
        phone,
        account_name,
        account_number,
        bank_name,
        crypto_network,
        crypto_address,
      } = req.body;

      const depositAmount =
        getNumber(amount);

      const allowedMethods = [
        "mpesa",
        "airtel",
        "bank",
        "card",
        "crypto",
      ];

      const cleanMethod =
        String(method || "")
          .trim()
          .toLowerCase();

      const cleanCurrency =
        String(currency || "USD")
          .trim()
          .toUpperCase();

      const paymentReference =
        String(
          transaction_reference ||
            reference ||
            ""
        ).trim();

      if (
        !Number.isFinite(
          depositAmount
        ) ||
        depositAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter a valid deposit amount.",
        });
      }

      if (
        !allowedMethods.includes(
          cleanMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid deposit method.",
        });
      }

      if (
        cleanMethod === "mpesa" ||
        cleanMethod === "airtel"
      ) {
        if (!paymentReference) {
          return res.status(400).json({
            success: false,
            error:
              "Payment transaction reference is required.",
          });
        }

        if (!phone) {
          return res.status(400).json({
            success: false,
            error:
              "Mobile money number is required.",
          });
        }
      }

      if (cleanMethod === "bank") {
        if (
          !account_name ||
          !account_number ||
          !bank_name
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Bank details are required.",
          });
        }
      }

      if (cleanMethod === "crypto") {
        if (!crypto_address) {
          return res.status(400).json({
            success: false,
            error:
              "Crypto wallet address is required.",
          });
        }
      }

      if (paymentReference) {
        const [
          duplicateRows,
        ] = await sql.query(
          `
            SELECT id
            FROM deposits
            WHERE transaction_reference = ?
            LIMIT 1
          `,
          [paymentReference]
        );

        if (
          duplicateRows.length > 0
        ) {
          return res.status(409).json({
            success: false,
            error:
              "This payment reference has already been submitted.",
          });
        }
      }

      const [result] =
        await sql.query(
          `
            INSERT INTO deposits
            (
              user_id,
              account_mode,
              amount,
              currency,
              method,
              status,
              transaction_reference,
              phone,
              account_name,
              account_number,
              bank_name,
              crypto_network,
              crypto_address
            )
            VALUES
            (
              ?,
              ?,
              ?,
              ?,
              ?,
              'pending',
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?
            )
          `,
          [
            userId,
            accountMode,
            depositAmount,
            cleanCurrency,
            cleanMethod,
            paymentReference || null,
            phone || null,
            account_name || null,
            account_number || null,
            bank_name || null,
            crypto_network || null,
            crypto_address || null,
          ]
        );

      return res.status(201).json({
        success: true,

        message:
          "Deposit request submitted successfully.",

        depositId:
          result.insertId,

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        amount:
          depositAmount,

        currency:
          cleanCurrency,

        method:
          cleanMethod,

        status:
          "pending",
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to create deposit request.",
        error
      );
    }
  }
);

/* =========================================================
   11. USER DEPOSITS
========================================================= */

app.get(
  "/api/deposits",
  requireTrader,
  async (req, res) => {
    try {
      const accountMode =
        getCurrentAccountMode(req);

      const [results] =
        await sql.query(
          `
            SELECT
              id,
              user_id,
              account_mode,
              amount,
              currency,
              method,
              status,
              transaction_reference,
              created_at,
              updated_at,
              approved_at,
              completed_at,
              rejection_reason,
              admin_note
            FROM deposits
            WHERE user_id = ?
            AND account_mode = ?
            ORDER BY created_at DESC
            LIMIT 100
          `,
          [
            req.session.userId,
            accountMode,
          ]
        );

      return res.json({
        success: true,
        accountMode,
        deposits: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load deposits.",
        error
      );
    }
  }
);

/* =========================================================
   12. USER DEPOSIT HISTORY
========================================================= */

app.get(
  "/api/deposits/history",
  requireTrader,
  async (req, res) => {
    try {
      const accountMode =
        getCurrentAccountMode(req);

      const [results] =
        await sql.query(
          `
            SELECT
              id,
              amount,
              currency,
              method,
              status,
              transaction_reference,
              phone,
              bank_name,
              crypto_network,
              created_at,
              updated_at,
              approved_at,
              completed_at,
              rejection_reason,
              admin_note,
              account_mode
            FROM deposits
            WHERE user_id = ?
            AND account_mode = ?
            ORDER BY created_at DESC
            LIMIT 100
          `,
          [
            req.session.userId,
            accountMode,
          ]
        );

      return res.json({
        success: true,
        accountMode,
        deposits: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load deposit history.",
        error
      );
    }
  }
);

/* =========================================================
   13. WITHDRAWAL
========================================================= */

app.post(
  "/api/withdrawals",
  requireTrader,
  async (req, res) => {
    const connection = db.promise();

    try {
      const userId =
        req.session.userId;

      const accountMode =
        getCurrentAccountMode(req);

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const {
        amount,
        currency = "USD",
        method,
        destination = {},
      } = req.body;

      const withdrawalAmount =
        getNumber(amount);

      const allowedMethods = [
        "mpesa",
        "airtel",
        "bank",
        "card",
        "crypto",
      ];

      const cleanMethod =
        String(method || "")
          .trim()
          .toLowerCase();

      const cleanCurrency =
        String(currency || "USD")
          .trim()
          .toUpperCase();

      if (
        !Number.isFinite(
          withdrawalAmount
        ) ||
        withdrawalAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter a valid withdrawal amount.",
        });
      }

      if (
        !allowedMethods.includes(
          cleanMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid withdrawal method.",
        });
      }

      if (
        cleanMethod === "mpesa" ||
        cleanMethod === "airtel"
      ) {
        if (
          !destination.phone ||
          String(
            destination.phone
          ).trim().length < 9
        ) {
          return res.status(400).json({
            success: false,
            error:
              "A valid mobile money number is required.",
          });
        }
      }

      if (cleanMethod === "bank") {
        if (
          !destination.accountHolder ||
          !destination.accountNumber ||
          !destination.bankName
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Complete bank details are required.",
          });
        }
      }

      if (cleanMethod === "card") {
        if (!destination.cardNumber) {
          return res.status(400).json({
            success: false,
            error:
              "Card details are required.",
          });
        }
      }

      if (cleanMethod === "crypto") {
        if (!destination.address) {
          return res.status(400).json({
            success: false,
            error:
              "Crypto wallet address is required.",
          });
        }
      }

      await connection.beginTransaction();

      const [
        walletRows,
      ] = await connection.query(
        `
          SELECT
            id,
            demo_balance,
            real_balance
          FROM wallets
          WHERE user_id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [userId]
      );

      if (walletRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "Wallet not found.",
        });
      }

      const currentBalance =
        Number(
          walletRows[0][
            balanceColumn
          ] || 0
        );

      if (
        currentBalance <
        withdrawalAmount
      ) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          error:
            `Insufficient ${accountMode} account balance.`,
        });
      }

      const newBalance =
        currentBalance -
        withdrawalAmount;

      await connection.query(
        `
          UPDATE wallets
          SET ${balanceColumn} = ?
          WHERE user_id = ?
        `,
        [
          newBalance,
          userId,
        ]
      );

      const phone =
        cleanMethod === "mpesa" ||
        cleanMethod === "airtel"
          ? String(
              destination.phone || ""
            ).trim()
          : null;

      const accountHolder =
        cleanMethod === "bank"
          ? String(
              destination.accountHolder ||
                ""
            ).trim()
          : null;

      const accountNumber =
        cleanMethod === "bank"
          ? String(
              destination.accountNumber ||
                ""
            ).trim()
          : null;

      const bankName =
        cleanMethod === "bank"
          ? String(
              destination.bankName ||
                ""
            ).trim()
          : null;

      const swift =
        cleanMethod === "bank"
          ? String(
              destination.swift || ""
            ).trim()
          : null;

      const cardNumber =
        cleanMethod === "card"
          ? String(
              destination.cardNumber ||
                ""
            ).replace(
              /\s+/g,
              ""
            )
          : "";

      const cardLast4 =
        cleanMethod === "card" &&
        cardNumber.length >= 4
          ? cardNumber.slice(-4)
          : null;

      const cryptoNetwork =
        cleanMethod === "crypto"
          ? String(
              destination.network ||
                ""
            ).trim()
          : null;

      const cryptoAddress =
        cleanMethod === "crypto"
          ? String(
              destination.address ||
                ""
            ).trim()
          : null;

      const [
        result,
      ] = await connection.query(
        `
          INSERT INTO withdrawals
          (
            user_id,
            account_mode,
            amount,
            currency,
            method,
            status,
            phone,
            account_holder,
            account_number,
            bank_name,
            swift,
            card_number,
            crypto_network,
            crypto_address
          )
          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            'pending',
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          )
        `,
        [
          userId,
          accountMode,
          withdrawalAmount,
          cleanCurrency,
          cleanMethod,
          phone,
          accountHolder,
          accountNumber,
          bankName,
          swift,
          cardLast4,
          cryptoNetwork,
          cryptoAddress,
        ]
      );

      await connection.commit();

      return res.status(201).json({
        success: true,

        message:
          "Withdrawal request submitted successfully.",

        withdrawalId:
          result.insertId,

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        amount:
          withdrawalAmount,

        currency:
          cleanCurrency,

        method:
          cleanMethod,

        status:
          "pending",

        balance:
          newBalance,
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to create withdrawal request.",
        error
      );
    }
  }
);

/* =========================================================
   14. USER WITHDRAWALS
========================================================= */

app.get(
  "/api/withdrawals",
  requireTrader,
  async (req, res) => {
    try {
      const accountMode =
        getCurrentAccountMode(req);

      const [results] =
        await sql.query(
          `
            SELECT
              id,
              user_id,
              account_mode,
              amount,
              currency,
              method,
              status,
              created_at,
              updated_at,
              approved_at,
              completed_at,
              rejection_reason,
              admin_note
            FROM withdrawals
            WHERE user_id = ?
            AND account_mode = ?
            ORDER BY created_at DESC
            LIMIT 100
          `,
          [
            req.session.userId,
            accountMode,
          ]
        );

      return res.json({
        success: true,
        accountMode,
        withdrawals: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load withdrawals.",
        error
      );
    }
  }
);

/* =========================================================
   15. USER WITHDRAWAL HISTORY
========================================================= */

app.get(
  "/api/withdrawals/history",
  requireTrader,
  async (req, res) => {
    try {
      const accountMode =
        getCurrentAccountMode(req);

      const [results] =
        await sql.query(
          `
            SELECT
              id,
              amount,
              currency,
              method,
              status,
              account_mode,
              phone,
              account_holder,
              account_number,
              bank_name,
              swift,
              card_number,
              crypto_network,
              crypto_address,
              created_at,
              updated_at,
              approved_at,
              completed_at,
              rejection_reason,
              admin_note
            FROM withdrawals
            WHERE user_id = ?
            AND account_mode = ?
            ORDER BY created_at DESC
            LIMIT 100
          `,
          [
            req.session.userId,
            accountMode,
          ]
        );

      return res.json({
        success: true,
        accountMode,
        withdrawals: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load withdrawal history.",
        error
      );
    }
  }
);

/* =========================================================
   16. EXECUTE SIMULATED TRADE
========================================================= */

app.post(
  "/api/trades/execute",
  requireTrader,
  async (req, res) => {
    const connection = db.promise();

    try {
      const userId =
        req.session.userId;

      const accountMode =
        getCurrentAccountMode(req);

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const {
        market,
        direction,
        stake,
        duration,
        entryPrice,
      } = req.body;

      if (!market) {
        return res.status(400).json({
          success: false,
          error:
            "Market is required.",
        });
      }

      if (
        direction !== "BUY" &&
        direction !== "SELL"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid trade direction.",
        });
      }

      const stakeAmount =
        Number(stake);

      const durationSeconds =
        Number(duration);

      const entry =
        Number(entryPrice);

      if (
        !Number.isFinite(
          stakeAmount
        ) ||
        stakeAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid stake amount.",
        });
      }

      if (
        !Number.isInteger(
          durationSeconds
        ) ||
        durationSeconds <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid trade duration.",
        });
      }

      if (
        !Number.isFinite(entry) ||
        entry <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid entry price.",
        });
      }

      const [
        settingsRows,
      ] = await connection.query(
        `
          SELECT
            min_stake,
            max_stake,
            payout_percent,
            trading_enabled
          FROM trading_settings
          LIMIT 1
        `
      );

      const settings =
        settingsRows.length > 0
          ? settingsRows[0]
          : {
              min_stake: 1,
              max_stake: 1000,
              payout_percent: 95,
              trading_enabled: 1,
            };

      if (
        Number(
          settings.trading_enabled
        ) !== 1
      ) {
        return res.status(403).json({
          success: false,
          error:
            "Trading is currently disabled by the administrator.",
        });
      }

      const minStake =
        Number(
          settings.min_stake
        );

      const maxStake =
        Number(
          settings.max_stake
        );

      if (
        stakeAmount <
        minStake
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Minimum stake is ${minStake}.`,
        });
      }

      if (
        stakeAmount >
        maxStake
      ) {
        return res.status(400).json({
          success: false,
          error:
            `Maximum stake is ${maxStake}.`,
        });
      }

      await connection.beginTransaction();

      const [
        walletRows,
      ] = await connection.query(
        `
          SELECT
            id,
            demo_balance,
            real_balance
          FROM wallets
          WHERE user_id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [userId]
      );

      if (walletRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "Wallet not found.",
        });
      }

      const currentBalance =
        Number(
          walletRows[0][
            balanceColumn
          ] || 0
        );

      if (
        currentBalance <
        stakeAmount
      ) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          error:
            `Insufficient ${accountMode} account balance.`,
        });
      }

      const newBalance =
        currentBalance -
        stakeAmount;

      await connection.query(
        `
          UPDATE wallets
          SET ${balanceColumn} = ?
          WHERE user_id = ?
        `,
        [
          newBalance,
          userId,
        ]
      );

      const expiresAt =
        new Date(
          Date.now() +
            durationSeconds *
              1000
        );

      const [
        tradeResult,
      ] = await connection.query(
        `
          INSERT INTO trades
          (
            user_id,
            account_mode,
            market,
            direction,
            stake,
            duration,
            entry_price,
            expires_at,
            status
          )
          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'ACTIVE'
          )
        `,
        [
          userId,
          accountMode,
          market,
          direction,
          stakeAmount,
          durationSeconds,
          entry,
          expiresAt,
        ]
      );

      await connection.commit();

      return res.status(201).json({
        success: true,

        message:
          `${getAccountLabel(
            accountMode
          )} trade executed successfully.`,

        isSimulated: true,

        tradeId:
          tradeResult.insertId,

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        newBalance,

        expiresAt,

        market,

        direction,

        stake:
          stakeAmount,

        duration:
          durationSeconds,

        entryPrice:
          entry,
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to execute trade.",
        error
      );
    }
  }
);

/* =========================================================
   17. SETTLE SIMULATED TRADE
========================================================= */

app.post(
  "/api/trades/settle",
  requireTrader,
  async (req, res) => {
    const connection = db.promise();

    try {
      const userId =
        req.session.userId;

      const {
        tradeId,
        exitPrice,
      } = req.body;

      const numericTradeId =
        Number(tradeId);

      const exit =
        Number(exitPrice);

      if (
        !Number.isInteger(
          numericTradeId
        ) ||
        numericTradeId <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid trade ID.",
        });
      }

      if (
        !Number.isFinite(exit) ||
        exit <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid exit price.",
        });
      }

      const [
        tradeRows,
      ] = await connection.query(
        `
          SELECT *
          FROM trades
          WHERE id = ?
          AND user_id = ?
          AND status = 'ACTIVE'
          LIMIT 1
        `,
        [
          numericTradeId,
          userId,
        ]
      );

      if (tradeRows.length === 0) {
        return res.status(404).json({
          success: false,
          error:
            "Trade not found or already settled.",
        });
      }

      const trade =
        tradeRows[0];

      const expiresAt =
        new Date(
          trade.expires_at
        );

      if (
        Number.isNaN(
          expiresAt.getTime()
        )
      ) {
        return res.status(500).json({
          success: false,
          error:
            "Invalid trade expiry.",
        });
      }

      if (
        Date.now() <
        expiresAt.getTime()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Trade duration has not expired yet.",

          expiresAt,
        });
      }

      /*
       * IMPORTANT:
       *
       * Settlement uses the account mode stored
       * on the trade itself.
       */
      const accountMode =
        normalizeAccountMode(
          trade.account_mode
        );

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const entry =
        Number(
          trade.entry_price
        );

      const stake =
        Number(trade.stake);

      const [
        settingsRows,
      ] = await connection.query(
        `
          SELECT payout_percent
          FROM trading_settings
          LIMIT 1
        `
      );

      const payoutRate =
        settingsRows.length > 0
          ? Number(
              settingsRows[0]
                .payout_percent
            ) / 100
          : 0.95;

      let resultStatus =
        "LOST";

      let payout = 0;

      let profit =
        -stake;

      if (
        (
          trade.direction ===
            "BUY" &&
          exit > entry
        ) ||
        (
          trade.direction ===
            "SELL" &&
          exit < entry
        )
      ) {
        resultStatus =
          "WON";

        profit =
          stake *
          payoutRate;

        payout =
          stake +
          profit;
      }

      await connection.beginTransaction();

      const [
        updateResult,
      ] = await connection.query(
        `
          UPDATE trades
          SET
            exit_price = ?,
            payout = ?,
            profit = ?,
            result = ?,
            status = 'SETTLED',
            settled_at = NOW()
          WHERE id = ?
          AND user_id = ?
          AND status = 'ACTIVE'
        `,
        [
          exit,
          payout,
          profit,
          resultStatus,
          numericTradeId,
          userId,
        ]
      );

      if (
        updateResult.affectedRows !==
        1
      ) {
        await connection.rollback();

        return res.status(409).json({
          success: false,
          error:
            "Trade was already settled.",
        });
      }

      if (payout > 0) {
        await connection.query(
          `
            UPDATE wallets
            SET ${balanceColumn} =
              ${balanceColumn} + ?
            WHERE user_id = ?
          `,
          [
            payout,
            userId,
          ]
        );
      }

      await connection.commit();

      const [
        balanceRows,
      ] = await connection.query(
        `
          SELECT
            demo_balance,
            real_balance
          FROM wallets
          WHERE user_id = ?
          LIMIT 1
        `,
        [userId]
      );

      const newBalance =
        balanceRows.length > 0
          ? Number(
              balanceRows[0][
                balanceColumn
              ] || 0
            )
          : 0;

      return res.json({
        success: true,

        message:
          "Trade settled successfully.",

        isSimulated: true,

        tradeId:
          numericTradeId,

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        result:
          resultStatus,

        profit,

        payout,

        newBalance,

        demoBalance:
          Number(
            balanceRows[0]
              ?.demo_balance || 0
          ),

        realBalance:
          Number(
            balanceRows[0]
              ?.real_balance || 0
          ),
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to settle trade.",
        error
      );
    }
  }
);

/* =========================================================
   18. TRADE HISTORY
========================================================= */

app.get(
  "/api/trades/history",
  requireTrader,
  async (req, res) => {
    try {
      const accountMode =
        getCurrentAccountMode(req);

      const [results] =
        await sql.query(
          `
            SELECT
              id,
              user_id,
              account_mode,
              market,
              direction,
              stake,
              duration,
              entry_price,
              exit_price,
              payout,
              profit,
              result,
              status,
              created_at,
              expires_at,
              settled_at
            FROM trades
            WHERE user_id = ?
            AND account_mode = ?
            ORDER BY created_at DESC
            LIMIT 100
          `,
          [
            req.session.userId,
            accountMode,
          ]
        );

      return res.json({
        success: true,
        accountMode,
        trades: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load trade history.",
        error
      );
    }
  }
);

/* =========================================================
   19. ADMIN DASHBOARD
========================================================= */

app.get(
  "/api/admin/dashboard",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        userRows,
      ] = await sql.query(
        `
          SELECT COUNT(*) AS total
          FROM users
          WHERE role = 'trader'
        `
      );

      const [
        depositRows,
      ] = await sql.query(
        `
          SELECT COUNT(*) AS total
          FROM deposits
          WHERE status = 'pending'
        `
      );

      const [
        withdrawalRows,
      ] = await sql.query(
        `
          SELECT COUNT(*) AS total
          FROM withdrawals
          WHERE status = 'pending'
        `
      );

      return res.json({
        success: true,

        message:
          `Welcome to the Admin Control Portal, ${req.session.name}!`,

        userId:
          req.session.userId,

        name:
          req.session.name,

        role:
          req.session.role,

        stats: {
          traders:
            Number(
              userRows[0]?.total || 0
            ),

          pendingDeposits:
            Number(
              depositRows[0]?.total || 0
            ),

          pendingWithdrawals:
            Number(
              withdrawalRows[0]?.total || 0
            ),
        },
      });
    } catch (error) {
      return sendServerError(
        res,
        "Could not load admin dashboard.",
        error
      );
    }
  }
);

/* =========================================================
   20. ADMIN SESSION CHECK
========================================================= */

app.get(
  "/api/admin/check-session",
  requireAdmin,
  (req, res) => {
    return res.json({
      success: true,

      status:
        "authenticated",

      userId:
        req.session.userId,

      role:
        req.session.role,

      name:
        req.session.name,
    });
  }
);

/* =========================================================
   21. ADMIN USERS
========================================================= */

app.get(
  "/api/admin/users",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        results,
      ] = await sql.query(
        `
          SELECT
            u.id,
            u.name,
            u.email,
            u.role,
            u.created_at,

            COALESCE(
              w.demo_balance,
              0
            ) AS demo_balance,

            COALESCE(
              w.real_balance,
              0
            ) AS real_balance

          FROM users u

          LEFT JOIN wallets w
            ON u.id = w.user_id

          ORDER BY u.created_at DESC
        `
      );

      return res.json({
        success: true,
        users: results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Database error.",
        error
      );
    }
  }
);

/* =========================================================
   22. ADMIN SETTINGS GET
========================================================= */

app.get(
  "/api/admin/settings",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        results,
      ] = await sql.query(
        `
          SELECT *
          FROM trading_settings
          LIMIT 1
        `
      );

      return res.json(
        results[0] || {}
      );
    } catch (error) {
      return sendServerError(
        res,
        "Database error.",
        error
      );
    }
  }
);

/* =========================================================
   23. ADMIN SETTINGS UPDATE
========================================================= */

app.post(
  "/api/admin/settings",
  requireAdmin,
  async (req, res) => {
    const {
      minStake,
      maxStake,
      payoutPercent,
      tradingEnabled,
    } = req.body;

    const min =
      Number(minStake);

    const max =
      Number(maxStake);

    const payout =
      Number(payoutPercent);

    /*
     * Correctly handle:
     *
     * true
     * false
     * "true"
     * "false"
     * 1
     * 0
     */
    const enabled =
      tradingEnabled === true ||
      tradingEnabled === 1 ||
      String(
        tradingEnabled
      ).toLowerCase() === "true"
        ? 1
        : 0;

    if (
      !Number.isFinite(min) ||
      min < 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid minimum stake.",
      });
    }

    if (
      !Number.isFinite(max) ||
      max <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid maximum stake.",
      });
    }

    if (min > max) {
      return res.status(400).json({
        success: false,
        error:
          "Minimum stake cannot be greater than maximum stake.",
      });
    }

    if (
      !Number.isFinite(payout) ||
      payout < 0 ||
      payout > 100
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Payout percentage must be between 0 and 100.",
      });
    }

    try {
      await sql.query(
        `
          UPDATE trading_settings
          SET
            min_stake = ?,
            max_stake = ?,
            payout_percent = ?,
            trading_enabled = ?
          WHERE id = 1
        `,
        [
          min,
          max,
          payout,
          enabled,
        ]
      );

      return res.json({
        success: true,

        message:
          "Trading settings updated successfully.",

        settings: {
          minStake: min,
          maxStake: max,
          payoutPercent: payout,
          tradingEnabled:
            enabled === 1,
        },
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to save settings.",
        error
      );
    }
  }
);

/* =========================================================
   24. ADMIN DEPOSITS
========================================================= */

app.get(
  "/api/admin/deposits",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        results,
      ] = await sql.query(
        `
          SELECT
            d.*,
            u.name AS user_name,
            u.email AS user_email

          FROM deposits d

          INNER JOIN users u
            ON d.user_id = u.id

          ORDER BY d.created_at DESC

          LIMIT 200
        `
      );

      return res.json({
        success: true,
        deposits:
          results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load deposits.",
        error
      );
    }
  }
);

/* =========================================================
   25. ADMIN APPROVE DEPOSIT
========================================================= */

app.post(
  "/api/admin/deposits/:id/approve",
  requireAdmin,
  async (req, res) => {
    const connection = db.promise();

    const depositId =
      Number(req.params.id);

    const adminId =
      req.session.userId;

    if (
      !Number.isInteger(
        depositId
      ) ||
      depositId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid deposit ID.",
      });
    }

    try {
      await connection.beginTransaction();

      const [
        depositRows,
      ] = await connection.query(
        `
          SELECT *
          FROM deposits
          WHERE id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [depositId]
      );

      if (depositRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "Deposit not found.",
        });
      }

      const deposit =
        depositRows[0];

      if (
        deposit.status !==
        "pending"
      ) {
        await connection.rollback();

        return res.status(409).json({
          success: false,
          error:
            `Deposit cannot be approved because its current status is "${deposit.status}".`,
        });
      }

      const accountMode =
        normalizeAccountMode(
          deposit.account_mode
        );

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const [
        walletRows,
      ] = await connection.query(
        `
          SELECT
            id,
            demo_balance,
            real_balance
          FROM wallets
          WHERE user_id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [
          deposit.user_id,
        ]
      );

      if (walletRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "User wallet not found.",
        });
      }

      const depositAmount =
        Number(
          deposit.amount
        );

      await connection.query(
        `
          UPDATE wallets
          SET ${balanceColumn} =
            ${balanceColumn} + ?
          WHERE user_id = ?
        `,
        [
          depositAmount,
          deposit.user_id,
        ]
      );

      await connection.query(
        `
          UPDATE deposits
          SET
            status = 'approved',
            approved_at = NOW(),
            approved_by = ?,
            updated_at = NOW()
          WHERE id = ?
          AND status = 'pending'
        `,
        [
          adminId,
          depositId,
        ]
      );

      await connection.commit();

      const wallet =
        await getUserWallet(
          deposit.user_id
        );

      return res.json({
        success: true,

        message:
          "Deposit approved successfully.",

        isSimulated: true,

        depositId,

        userId:
          deposit.user_id,

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        amount:
          depositAmount,

        newBalance:
          Number(
            wallet[
              balanceColumn
            ] || 0
          ),

        demoBalance:
          Number(
            wallet.demo_balance || 0
          ),

        realBalance:
          Number(
            wallet.real_balance || 0
          ),
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to approve deposit.",
        error
      );
    }
  }
);

/* =========================================================
   26. ADMIN REJECT DEPOSIT
========================================================= */

app.post(
  "/api/admin/deposits/:id/reject",
  requireAdmin,
  async (req, res) => {
    const depositId =
      Number(req.params.id);

    const {
      reason =
        "Deposit rejected by administrator.",
    } = req.body;

    if (
      !Number.isInteger(
        depositId
      ) ||
      depositId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid deposit ID.",
      });
    }

    try {
      const [
        result,
      ] = await sql.query(
        `
          UPDATE deposits
          SET
            status = 'rejected',
            rejection_reason = ?,
            admin_note = ?,
            updated_at = NOW()
          WHERE id = ?
          AND status = 'pending'
        `,
        [
          String(reason),
          String(reason),
          depositId,
        ]
      );

      if (
        result.affectedRows !==
        1
      ) {
        return res.status(409).json({
          success: false,
          error:
            "Deposit was already processed or does not exist.",
        });
      }

      return res.json({
        success: true,

        message:
          "Deposit rejected successfully.",

        depositId,

        status:
          "rejected",
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to reject deposit.",
        error
      );
    }
  }
);

/* =========================================================
   27. ADMIN WITHDRAWALS
========================================================= */

app.get(
  "/api/admin/withdrawals",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        results,
      ] = await sql.query(
        `
          SELECT
            w.*,
            u.name AS user_name,
            u.email AS user_email

          FROM withdrawals w

          INNER JOIN users u
            ON w.user_id = u.id

          ORDER BY w.created_at DESC

          LIMIT 200
        `
      );

      return res.json({
        success: true,
        withdrawals:
          results,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to load withdrawals.",
        error
      );
    }
  }
);

/* =========================================================
   28. ADMIN APPROVE WITHDRAWAL
========================================================= */

app.post(
  "/api/admin/withdrawals/:id/approve",
  requireAdmin,
  async (req, res) => {
    const withdrawalId =
      Number(req.params.id);

    const adminId =
      req.session.userId;

    if (
      !Number.isInteger(
        withdrawalId
      ) ||
      withdrawalId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid withdrawal ID.",
      });
    }

    try {
      const [
        result,
      ] = await sql.query(
        `
          UPDATE withdrawals
          SET
            status = 'approved',
            approved_at = NOW(),
            approved_by = ?,
            updated_at = NOW()
          WHERE id = ?
          AND status = 'pending'
        `,
        [
          adminId,
          withdrawalId,
        ]
      );

      if (
        result.affectedRows !==
        1
      ) {
        return res.status(409).json({
          success: false,
          error:
            "Withdrawal was already processed or does not exist.",
        });
      }

      return res.json({
        success: true,

        message:
          "Withdrawal approved successfully.",

        isSimulated: true,

        withdrawalId,

        status:
          "approved",

        payoutReady:
          true,
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to approve withdrawal.",
        error
      );
    }
  }
);

/* =========================================================
   29. ADMIN REJECT WITHDRAWAL
========================================================= */

app.post(
  "/api/admin/withdrawals/:id/reject",
  requireAdmin,
  async (req, res) => {
    const connection = db.promise();

    const withdrawalId =
      Number(req.params.id);

    const {
      reason =
        "Withdrawal rejected by administrator.",
    } = req.body;

    if (
      !Number.isInteger(
        withdrawalId
      ) ||
      withdrawalId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid withdrawal ID.",
      });
    }

    try {
      await connection.beginTransaction();

      const [
        withdrawalRows,
      ] = await connection.query(
        `
          SELECT *
          FROM withdrawals
          WHERE id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [withdrawalId]
      );

      if (
        withdrawalRows.length ===
        0
      ) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "Withdrawal not found.",
        });
      }

      const withdrawal =
        withdrawalRows[0];

      if (
        withdrawal.status !==
        "pending"
      ) {
        await connection.rollback();

        return res.status(409).json({
          success: false,
          error:
            `Withdrawal cannot be rejected because its current status is "${withdrawal.status}".`,
        });
      }

      const accountMode =
        normalizeAccountMode(
          withdrawal.account_mode
        );

      const balanceColumn =
        getBalanceColumn(
          accountMode
        );

      const amount =
        Number(
          withdrawal.amount
        );

      /*
       * Return funds to the SAME account
       * from which they were reserved.
       */
      await connection.query(
        `
          UPDATE wallets
          SET ${balanceColumn} =
            ${balanceColumn} + ?
          WHERE user_id = ?
        `,
        [
          amount,
          withdrawal.user_id,
        ]
      );

      await connection.query(
        `
          UPDATE withdrawals
          SET
            status = 'rejected',
            rejection_reason = ?,
            admin_note = ?,
            updated_at = NOW()
          WHERE id = ?
          AND status = 'pending'
        `,
        [
          String(reason),
          String(reason),
          withdrawalId,
        ]
      );

      await connection.commit();

      const wallet =
        await getUserWallet(
          withdrawal.user_id
        );

      return res.json({
        success: true,

        message:
          "Withdrawal rejected and funds returned.",

        isSimulated: true,

        withdrawalId,

        status:
          "rejected",

        accountMode,

        accountLabel:
          getAccountLabel(
            accountMode
          ),

        returnedAmount:
          amount,

        newBalance:
          Number(
            wallet[
              balanceColumn
            ] || 0
          ),

        demoBalance:
          Number(
            wallet.demo_balance || 0
          ),

        realBalance:
          Number(
            wallet.real_balance || 0
          ),
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to reject withdrawal.",
        error
      );
    }
  }
);

/* =========================================================
   30. ADMIN COMPLETE WITHDRAWAL
========================================================= */

app.post(
  "/api/admin/withdrawals/:id/complete",
  requireAdmin,
  async (req, res) => {
    const withdrawalId =
      Number(req.params.id);

    if (
      !Number.isInteger(
        withdrawalId
      ) ||
      withdrawalId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid withdrawal ID.",
      });
    }

    try {
      const [
        result,
      ] = await sql.query(
        `
          UPDATE withdrawals
          SET
            status = 'completed',
            completed_at = NOW(),
            updated_at = NOW()
          WHERE id = ?
          AND status = 'approved'
        `,
        [withdrawalId]
      );

      if (
        result.affectedRows !==
        1
      ) {
        return res.status(409).json({
          success: false,
          error:
            "Withdrawal must be approved before it can be completed.",
        });
      }

      return res.json({
        success: true,

        message:
          "Withdrawal marked as completed.",

        isSimulated: true,

        withdrawalId,

        status:
          "completed",
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to complete withdrawal.",
        error
      );
    }
  }
);

/* =========================================================
   31. ADMIN ADD FUNDS TO USER REAL ACCOUNT
=========================================================

   This is for your LOCAL/SIMULATED system.

   Example request:

   POST /api/admin/users/1/real-balance

   Body:
   {
     "amount": 50000
   }

   It adds KES 50,000 to real_balance.
========================================================= */

app.post(
  "/api/admin/users/:id/real-balance",
  requireAdmin,
  async (req, res) => {
    const userId =
      Number(req.params.id);

    const amount =
      Number(req.body.amount);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid user ID.",
      });
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Amount must be greater than zero.",
      });
    }

    const connection = db.promise();

    try {
      await connection.beginTransaction();

      const [
        userRows,
      ] = await connection.query(
        `
          SELECT
            id,
            name,
            email,
            role
          FROM users
          WHERE id = ?
          LIMIT 1
          FOR UPDATE
        `,
        [userId]
      );

      if (userRows.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          success: false,
          error:
            "Trader not found.",
        });
      }

      await connection.query(
        `
          INSERT INTO wallets
          (
            user_id,
            demo_balance,
            real_balance
          )
          VALUES
          (
            ?,
            0.00,
            ?
          )
          ON DUPLICATE KEY UPDATE
            real_balance =
              real_balance + VALUES(real_balance)
        `,
        [
          userId,
          amount,
        ]
      );

      await connection.commit();

      const wallet =
        await getUserWallet(
          userId
        );

      return res.json({
        success: true,

        isSimulated: true,

        message:
          "Simulated REAL account balance updated successfully.",

        user: {
          id:
            userRows[0].id,

          name:
            userRows[0].name,

          email:
            userRows[0].email,
        },

        addedAmount:
          amount,

        demoBalance:
          Number(
            wallet.demo_balance || 0
          ),

        realBalance:
          Number(
            wallet.real_balance || 0
          ),
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch {}

      return sendServerError(
        res,
        "Failed to update simulated real balance.",
        error
      );
    }
  }
);

/* =========================================================
   32. ADMIN SET EXACT REAL BALANCE
=========================================================

   POST /api/admin/users/1/real-balance/set

   Body:
   {
     "amount": 50000
   }

   This makes real_balance exactly 50,000.
========================================================= */

app.post(
  "/api/admin/users/:id/real-balance/set",
  requireAdmin,
  async (req, res) => {
    const userId =
      Number(req.params.id);

    const amount =
      Number(req.body.amount);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid user ID.",
      });
    }

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Amount cannot be negative.",
      });
    }

    try {
      await ensureWallet(userId);

      const [
        result,
      ] = await sql.query(
        `
          UPDATE wallets
          SET real_balance = ?
          WHERE user_id = ?
        `,
        [
          amount,
          userId,
        ]
      );

      if (
        result.affectedRows !==
        1
      ) {
        return res.status(404).json({
          success: false,
          error:
            "Wallet not found.",
        });
      }

      const wallet =
        await getUserWallet(
          userId
        );

      return res.json({
        success: true,

        isSimulated: true,

        message:
          "Simulated REAL account balance set successfully.",

        userId,

        demoBalance:
          Number(
            wallet.demo_balance || 0
          ),

        realBalance:
          Number(
            wallet.real_balance || 0
          ),
      });
    } catch (error) {
      return sendServerError(
        res,
        "Failed to set real balance.",
        error
      );
    }
  }
);

/* =========================================================
   33. HEALTH CHECK
========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    return res.json({
      success: true,

      status: "ok",

      server:
        "PIPMASTER TRADING API",

      port: PORT,

      database:
        "trading_app",

      accounts: [
        "demo",
        "real",
      ],

      realAccount:
        "SIMULATED",
    });
  }
);

/* =========================================================
   34. API 404
========================================================= */

app.use(
  "/api",
  (req, res) => {
    return res.status(404).json({
      success: false,

      error:
        "API endpoint not found.",

      path:
        req.originalUrl,

      method:
        req.method,
    });
  }
);

/* =========================================================
   35. GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "Unhandled server error:",
      err
    );

    if (res.headersSent) {
      return next(err);
    }

    return res.status(500).json({
      success: false,
      error:
        "Internal server error.",
    });
  }
);

/* =========================================================
   36. SERVER
========================================================= */

app.listen(
  PORT,
  () => {
    console.log("");

    console.log(
      "=========================================="
    );

    console.log(
      " PIPMASTER TRADING API"
    );

    console.log(
      "=========================================="
    );

    console.log(
      ` Server: http://localhost:${PORT}`
    );

    console.log(
      " Accounts: DEMO + REAL (SIMULATED)"
    );

    console.log(
      " Database: trading_app"
    );

    console.log(
      "=========================================="
    );

    console.log("");
  }
);