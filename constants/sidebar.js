export const sidebarJson = [
    {
      moduleName: "Dashboard",
      isOpen: true,
      pageDetails: [
        {
          pageName: "Dashboard",
          pageLink: "/home",
          icon: "bi bi-grid-3x3-gap",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "User Management",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Merchants",
          pageLink: "/home/user-management/merchants",
          icon: "bi bi-person",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Acquirers",
          pageLink: "/home/user-management/acquirers",
          icon: "bi bi-person",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Resellers",
          pageLink: "/home/user-management/resellers",
          icon: "bi bi-person",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    // {
    //   moduleName: "Teams",
    //   isOpen: false,
    //   pageDetails: [
    //     {
    //       pageName: "Sub Admin",
    //       pageLink: "/home/team/sub-admins",
    //       icon: "bi bi-people",
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //     {
    //       pageName: "Sub merchant",
    //       pageLink: "/home/team/sub-merchants",
    //       icon: "bi bi-people",
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //   ],
    // },
    {
      moduleName: "PayIn",
      isOpen: false,
      pageDetails: [
        // {
        //   pageName: "Orders",
        //   pageLink: "/home/transaction/orders",
        //   icon: "bi bi-cash-coin",
        //   isActive: false,
        //   isOpen: false,
        //   submenu: [],
        // },
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payin",
          icon: "bi bi-cash-coin",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Settlements",
          pageLink: "/home/settlements/auth-settlement", // No direct link for "Settlements" in the provided code, using "#" as a placeholder
          icon: "bi bi-hand-thumbs-up",
          isActive: false,
          isOpen: false,
          submenu: [
            // {
            //   pageName: "Authorized",
            //   pageLink: "/home/settlements/auth-settlement",
            //   isActive: false,
            // },
            // {
            //   pageName: "Captured(Sale)",
            //   pageLink: "/home/settlements/sale-settlement",
            //   isActive: false,
            // },
            // {
            //   pageName: "All Settlements",
            //   pageLink: "/home/settlements/all-settlement",
            //   isActive: false,
            // },
            // {
            //   pageName: "Refund",
            //   pageLink: "/home/settlements/refund",
            //   isActive: false,
            // },
          ],
        },
        {
          pageName: "Remittance",
          pageLink: "/home/remittance",
          icon: "bi bi-currency-exchange",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Chargeback",
          pageLink: "/home/charge-back",
          icon: "bi bi-arrow-clockwise",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Reports",
          pageLink: "#", // No direct "Reports" under PayIn in the provided code
          icon: "bi bi-file-earmark-bar-graph", // Generic report icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    // {
    //   moduleName: "Payments Links",
    //   isOpen: false,
    //   pageDetails: [
    //     {
    //       pageName: "Payment Link",
    //       pageLink: "/home/payment-links",
    //       icon: "bi bi-link-45deg",
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //     {
    //       pageName: "Reports",
    //       pageLink: "/home/payment-links", // Assuming the main Payment Link page also serves as a report overview or has a separate reports section within it. Adjust if needed.
    //       icon: "bi bi-file-earmark-bar-graph",
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //   ],
    // },
    {
      moduleName: "Payout",
      isOpen: false,
      pageDetails: [
        {
          pageName: "User Accounts",
          pageLink: "/home/payout/userAccounts",
          icon: "bi bi-wallet2", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Load Money",
          pageLink: "/home/payout/loadMoney",
          icon: "bi bi-wallet2", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Beneficiaries",
          pageLink: "/home/payout/beneficiaries",
          icon: "bi bi-person-check", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payout", // Reusing existing transaction link, adjust if Payout transactions are different
          icon: "bi bi-arrow-left-right", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transfer Money",
          pageLink: "/home/payout/transfer/add-transfer", // Reusing existing transaction link, adjust if Payout transactions are different
          icon: "bi bi-arrow-left-right", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        
      ],
    },
    {
      moduleName: "Settings",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Country",
          pageLink: "/home/settings/country",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Currency",
          pageLink: "/home/settings/currency",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Payment Types",
          pageLink: "/home/settings/payment-type",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transfer Modes",
          pageLink: "/home/settings/transfer-mode",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Mop Types",
          pageLink: "/home/settings/mop-type",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Surcharge",
          pageLink: "/home/settings/surcharge",
          icon: "bi bi-gear",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Fraud Preventations",
          pageLink: "/home/fraud-prevention",
          icon: "bi bi-slash-circle",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "API Documentation",
      isOpen: false,
      pageDetails: [
        {
          pageName: "API Documentation",
          pageLink: "/home/documentation",
          icon: "bi bi-file-code",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Change Password",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Change Password",
          pageLink: "/home/reset-password",
          icon: "bi bi-shield-lock",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Login History",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Login History",
          pageLink: "/home/login-history",
          icon: "bi bi-list-check",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
  ];




  export const merchantSidebarJson = [
    {
      moduleName: "Dashboard",
      isOpen: true,
      pageDetails: [
        {
          pageName: "Dashboard",
          pageLink: "/home",
          icon: "bi bi-grid-3x3-gap",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    // {
    //   moduleName: "Teams",
    //   isOpen: false,
    //   pageDetails: [
    //     {
    //       pageName: "Sub merchant",
    //       pageLink: "/home/team/sub-merchants",
    //       icon: "bi bi-people-fill", // Example icon (adjust if needed)
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //   ],
    // },
    {
      moduleName: "PayIn",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Orders",
          pageLink: "/home/transaction/orders",
          icon: "bi bi-list-task", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payin",
          icon: "bi bi-arrow-left-right", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Settlements",
          pageLink: "#", // No direct link in the provided component
          icon: "bi bi-cash-coin", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [
            {
              pageName: "Authorized",
              pageLink: "/home/settlements/auth-settlement",
              isActive: false,
            },
            {
              pageName: "Captured(Sale)",
              pageLink: "/home/settlements/sale-settlement",
              isActive: false,
            },
            {
              pageName: "All Settlements",
              pageLink: "/home/settlements/all-settlement",
              isActive: false,
            },
            {
              pageName: "Refund",
              pageLink: "/home/settlements/refund",
              isActive: false,
            },
          ],
        },
        {
          pageName: "Remittance",
          pageLink: "/home/remittance",
          icon: "bi bi-send", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Chargeback",
          pageLink: "/home/charge-back", // Link not directly in MerchantMenu, assuming a similar path
          icon: "bi bi-arrow-return-left", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Reports",
          pageLink: "#", // No direct "Reports" under PayIn
          icon: "bi bi-file-earmark-bar-graph", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    // {
    //   moduleName: "Payments Links",
    //   isOpen: false,
    //   pageDetails: [
    //     {
    //       pageName: "PaymentLinks",
    //       pageLink: "/home/payment-links",
    //       icon: "bi bi-link-45deg",
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //     {
    //       pageName: "Reports",
    //       pageLink: "/home/payment-links", // Assuming reports are on the same page or a sub-section
    //       icon: "bi bi-file-earmark-bar-graph", // Example icon (adjust if needed)
    //       isActive: false,
    //       isOpen: false,
    //       submenu: [],
    //     },
    //   ],
    // },
    {
      moduleName: "Payout",
      isOpen: false,
      pageDetails: [
        {
          pageName: "User Accounts",
          pageLink: "/home/payout/userAccounts",
          icon: "bi bi-wallet2", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Load Money",
          pageLink: "/home/payout/loadMoney",
          icon: "bi bi-wallet2", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Beneficiaries",
          pageLink: "/home/payout/beneficiaries",
          icon: "bi bi-person-check", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payin", // Reusing existing transaction link, adjust if Payout transactions are different
          icon: "bi bi-arrow-left-right", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transaction Reports",
          pageLink: "#", // Not in MerchantMenu
          icon: "bi bi-file-text", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Ledger Reports",
          pageLink: "#", // Not in MerchantMenu
          icon: "bi bi-book-half", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Settings",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Fraud Preventations",
          pageLink: "/home/fraud-prevention",
          icon: "bi bi-shield-exclamation", // Example icon (adjust if needed)
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "API Documentation",
      isOpen: false,
      pageDetails: [
        {
          pageName: "API Documentation",
          pageLink: "/home/documentation",
          icon: "bi bi-file-code",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Change Password",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Change Password",
          pageLink: "/home/reset-password",
          icon: "bi bi-key", 
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Login History",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Login History",
          pageLink: "/home/login-history",
          icon: "bi bi-clock-history",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    // API Documentation moved to Settings section
  ];


  export const resellerSidebarJson = [
    {
      moduleName: "Dashboard",
      isOpen: true,
      pageDetails: [
        {
          pageName: "Dashboard",
          pageLink: "/home",
          icon: "bi bi-grid-3x3-gap",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "User Management",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Merchants",
          pageLink: "/home/user-management/merchants", // Assuming resellers can view merchants
          icon: "bi bi-shop", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "PayIn",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Orders",
          pageLink: "/home/transaction/orders",
          icon: "bi bi-list-task", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payin",
          icon: "bi bi-arrow-left-right", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Settlements",
          pageLink: "#", // No direct link for "Settlements"
          icon: "bi bi-cash-coin", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [
            {
              pageName: "Authorized",
              pageLink: "/home/settlements/auth-settlement",
              isActive: false,
            },
            {
              pageName: "Captured(Sale)",
              pageLink: "/home/settlements/sale-settlement",
              isActive: false,
            },
            {
              pageName: "All Settlements",
              pageLink: "/home/settlements/all-settlement",
              isActive: false,
            },
            {
              pageName: "Refund",
              pageLink: "/home/settlements/refund",
              isActive: false,
            },
          ],
        },
        {
          pageName: "Remittance",
          pageLink: "/home/remittance",
          icon: "bi bi-send", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Chargeback",
          pageLink: "/home/charge-back", // Assuming similar path
          icon: "bi bi-arrow-return-left", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Reports",
          pageLink: "#", // No direct "Reports" under PayIn
          icon: "bi bi-file-earmark-bar-graph", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Payout",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Transactions",
          pageLink: "/home/transaction/payin", // Reusing existing transaction link, adjust if different
          icon: "bi bi-arrow-left-right", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Transaction Reports",
          pageLink: "#", // Not directly in ResellerMenu
          icon: "bi bi-file-text", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
        {
          pageName: "Ledger Reports",
          pageLink: "#", // Not directly in ResellerMenu
          icon: "bi bi-book-half", // Example icon
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "API Documentation",
      isOpen: false,
      pageDetails: [
        {
          pageName: "API Documentation",
          pageLink: "/home/documentation",
          icon: "bi bi-file-code",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Change Password",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Change Password",
          pageLink: "/home/reset-password",
          icon: "bi bi-key",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
    {
      moduleName: "Login History",
      isOpen: false,
      pageDetails: [
        {
          pageName: "Login History",
          pageLink: "/home/login-history",
          icon: "bi bi-clock-history",
          isActive: false,
          isOpen: false,
          submenu: [],
        },
      ],
    },
  ];

  