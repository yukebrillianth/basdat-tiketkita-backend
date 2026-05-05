const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "TiketKita API",
    version: "1.0.0",
    description: "REST API for TiketKita online ticketing platform",
  },
  servers: [{ url: "http://localhost:3000", description: "Development" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http" as const,
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object" as const,
        properties: {
          success: { type: "boolean" as const, example: true },
          message: { type: "string" as const, example: "Success" },
          data: {},
        },
      },
      ErrorResponse: {
        type: "object" as const,
        properties: {
          success: { type: "boolean" as const, example: false },
          message: { type: "string" as const, example: "Error message" },
          errors: { nullable: true },
        },
      },
      RegisterRequest: {
        type: "object" as const,
        required: ["fullname", "email", "password"],
        properties: {
          fullname: {
            type: "string" as const,
            minLength: 2,
            maxLength: 100,
            example: "John Doe",
          },
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
          phone: {
            type: "string" as const,
            example: "081234567890",
            description: "Optional phone number",
          },
          password: {
            type: "string" as const,
            minLength: 8,
            maxLength: 128,
            description:
              "Must contain uppercase, lowercase, and number",
            example: "Password123",
          },
        },
      },
      LoginRequest: {
        type: "object" as const,
        required: ["email", "password"],
        properties: {
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string" as const,
            example: "Password123",
          },
        },
      },
      SafeUser: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          fullname: { type: "string" as const, example: "John Doe" },
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
          phone: {
            type: "string" as const,
            nullable: true,
            example: "081234567890",
          },
          role: {
            type: "string" as const,
            enum: ["user", "admin"],
            example: "user",
          },
          is_verified: { type: "boolean" as const, example: false },
          created_at: {
            type: "string" as const,
            format: "date-time",
          },
          updated_at: {
            type: "string" as const,
            format: "date-time",
          },
        },
      },
      LoginResponse: {
        type: "object" as const,
        properties: {
          user: { $ref: "#/components/schemas/SafeUser" },
          token: {
            type: "string" as const,
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      VerifyEmailRequest: {
        type: "object" as const,
        required: ["email", "code"],
        properties: {
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
          code: {
            type: "string" as const,
            minLength: 6,
            maxLength: 6,
            pattern: "^[0-9]{6}$",
            example: "123456",
            description: "6-digit verification code",
          },
        },
      },
      ResendVerificationRequest: {
        type: "object" as const,
        required: ["email"],
        properties: {
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
        },
      },
      ForgotPasswordRequest: {
        type: "object" as const,
        required: ["email"],
        properties: {
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
        },
      },
      ResetPasswordRequest: {
        type: "object" as const,
        required: ["email", "code", "password"],
        properties: {
          email: {
            type: "string" as const,
            format: "email",
            example: "john@example.com",
          },
          code: {
            type: "string" as const,
            minLength: 6,
            maxLength: 6,
            pattern: "^[0-9]{6}$",
            example: "123456",
            description: "6-digit reset code",
          },
          password: {
            type: "string" as const,
            minLength: 8,
            maxLength: 128,
            description:
              "Must contain uppercase, lowercase, and number",
            example: "NewPassword123",
          },
        },
      },
      Pagination: {
        type: "object" as const,
        properties: {
          total: { type: "integer" as const, example: 100 },
          page: { type: "integer" as const, example: 1 },
          limit: { type: "integer" as const, example: 10 },
          totalPages: { type: "integer" as const, example: 10 },
        },
      },
      // ── Event Schemas ─────────────────────────────────────
      Event: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          title: { type: "string" as const, example: "Konser Musik Jakarta 2025" },
          description: { type: "string" as const, nullable: true, example: "Festival musik terbesar di Jakarta" },
          category_id: { type: "string" as const, format: "uuid" },
          venue_id: { type: "string" as const, format: "uuid" },
          date_start: { type: "string" as const, format: "date-time" },
          date_end: { type: "string" as const, format: "date-time" },
          status: { type: "string" as const, enum: ["draft", "published", "cancelled", "completed"], example: "published" },
          poster_url: { type: "string" as const, nullable: true, example: "https://example.com/poster.jpg" },
          created_by: { type: "string" as const, format: "uuid" },
          created_at: { type: "string" as const, format: "date-time" },
          updated_at: { type: "string" as const, format: "date-time" },
          deleted_at: { type: "string" as const, format: "date-time", nullable: true },
        },
      },
      EventListItem: {
        type: "object" as const,
        description: "Event with joined category and venue names",
        allOf: [
          { $ref: "#/components/schemas/Event" },
          {
            type: "object" as const,
            properties: {
              category_name: { type: "string" as const, example: "Konser" },
              venue_name: { type: "string" as const, example: "Gelora Bung Karno" },
              venue_city: { type: "string" as const, example: "Jakarta" },
            },
          },
        ],
      },
      EventDetail: {
        type: "object" as const,
        description: "Event with nested category, venue, and ticket types",
        allOf: [
          { $ref: "#/components/schemas/Event" },
          {
            type: "object" as const,
            properties: {
              category: {
                type: "object" as const,
                properties: {
                  id: { type: "string" as const, format: "uuid" },
                  name: { type: "string" as const, example: "Konser" },
                },
              },
              venue: {
                type: "object" as const,
                properties: {
                  id: { type: "string" as const, format: "uuid" },
                  name: { type: "string" as const, example: "Gelora Bung Karno" },
                  city: { type: "string" as const, example: "Jakarta" },
                  address: { type: "string" as const, example: "Jl. Pintu Satu Senayan" },
                  capacity: { type: "integer" as const, example: 80000 },
                },
              },
              ticket_types: {
                type: "array" as const,
                items: { $ref: "#/components/schemas/TicketType" },
              },
            },
          },
        ],
      },
      CreateEventRequest: {
        type: "object" as const,
        required: ["title", "category_id", "venue_id", "date_start", "date_end"],
        properties: {
          title: { type: "string" as const, minLength: 1, maxLength: 200, example: "Konser Musik Jakarta 2025" },
          description: { type: "string" as const, nullable: true, example: "Festival musik terbesar di Jakarta" },
          category_id: { type: "string" as const, format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
          venue_id: { type: "string" as const, format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
          date_start: { type: "string" as const, format: "date-time", example: "2025-12-01T19:00:00.000Z" },
          date_end: { type: "string" as const, format: "date-time", example: "2025-12-01T23:00:00.000Z" },
          status: { type: "string" as const, enum: ["draft", "published", "cancelled", "completed"], example: "draft" },
          poster_url: { type: "string" as const, format: "uri", nullable: true, example: "https://example.com/poster.jpg" },
        },
      },
      UpdateEventRequest: {
        type: "object" as const,
        description: "All fields are optional for partial update",
        properties: {
          title: { type: "string" as const, minLength: 1, maxLength: 200, example: "Konser Musik Jakarta 2025 - Updated" },
          description: { type: "string" as const, nullable: true },
          category_id: { type: "string" as const, format: "uuid" },
          venue_id: { type: "string" as const, format: "uuid" },
          date_start: { type: "string" as const, format: "date-time" },
          date_end: { type: "string" as const, format: "date-time" },
          status: { type: "string" as const, enum: ["draft", "published", "cancelled", "completed"] },
          poster_url: { type: "string" as const, format: "uri", nullable: true },
        },
      },
      // ── Ticket Schemas ────────────────────────────────────
      TicketType: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          event_id: { type: "string" as const, format: "uuid" },
          name: { type: "string" as const, example: "VIP" },
          price: { type: "number" as const, description: "Price in Rupiah (DECIMAL 12,2)", example: 500000 },
          quota: { type: "integer" as const, example: 100 },
          available: { type: "integer" as const, example: 85 },
          max_per_order: { type: "integer" as const, example: 5 },
          created_at: { type: "string" as const, format: "date-time" },
          updated_at: { type: "string" as const, format: "date-time" },
        },
      },
      CreateTicketRequest: {
        type: "object" as const,
        required: ["name", "price", "quota"],
        properties: {
          name: { type: "string" as const, minLength: 1, maxLength: 100, example: "VIP" },
          price: { type: "number" as const, minimum: 0, description: "Price in Rupiah", example: 500000 },
          quota: { type: "integer" as const, minimum: 1, example: 100 },
          max_per_order: { type: "integer" as const, minimum: 1, maximum: 10, default: 5, example: 5 },
        },
      },
      UpdateTicketRequest: {
        type: "object" as const,
        description: "All fields are optional for partial update",
        properties: {
          name: { type: "string" as const, minLength: 1, maxLength: 100, example: "VIP Gold" },
          price: { type: "number" as const, minimum: 0, example: 750000 },
          quota: { type: "integer" as const, minimum: 1, example: 150 },
          max_per_order: { type: "integer" as const, minimum: 1, maximum: 10, example: 3 },
        },
      },
      // ── Order Schemas ─────────────────────────────────────
      Order: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          order_number: { type: "string" as const, example: "TK-20250815-A3X9K" },
          user_id: { type: "string" as const, format: "uuid" },
          promo_id: { type: "string" as const, format: "uuid", nullable: true },
          subtotal: { type: "number" as const, description: "Subtotal in Rupiah", example: 1000000 },
          discount: { type: "number" as const, description: "Discount in Rupiah", example: 50000 },
          admin_fee: { type: "number" as const, description: "Admin fee in Rupiah", example: 4000 },
          total: { type: "number" as const, description: "Total in Rupiah", example: 954000 },
          status: { type: "string" as const, enum: ["pending", "waiting_payment", "paid", "cancelled", "expired"], example: "waiting_payment" },
          expired_at: { type: "string" as const, format: "date-time" },
          created_at: { type: "string" as const, format: "date-time" },
          updated_at: { type: "string" as const, format: "date-time" },
        },
      },
      OrderItem: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          order_id: { type: "string" as const, format: "uuid" },
          ticket_type_id: { type: "string" as const, format: "uuid" },
          ticket_name: { type: "string" as const, description: "Snapshot of ticket name at order time", example: "VIP" },
          ticket_price: { type: "number" as const, description: "Snapshot of ticket price in Rupiah", example: 500000 },
          quantity: { type: "integer" as const, example: 2 },
          subtotal: { type: "number" as const, description: "ticket_price × quantity", example: 1000000 },
          created_at: { type: "string" as const, format: "date-time" },
        },
      },
      Payment: {
        type: "object" as const,
        properties: {
          id: { type: "string" as const, format: "uuid" },
          order_id: { type: "string" as const, format: "uuid" },
          payment_method_id: { type: "string" as const, format: "uuid" },
          unique_code: { type: "integer" as const, description: "3-digit suffix for bank transfer, 0 for QRIS/ewallet", example: 123 },
          total: { type: "number" as const, description: "Total in Rupiah", example: 954000 },
          payment_code: { type: "string" as const, nullable: true, example: null },
          status: { type: "string" as const, enum: ["pending", "success", "failed"], example: "pending" },
          paid_at: { type: "string" as const, format: "date-time", nullable: true },
          created_at: { type: "string" as const, format: "date-time" },
          updated_at: { type: "string" as const, format: "date-time" },
        },
      },
      OrderDetail: {
        type: "object" as const,
        description: "Order with items and payment details",
        properties: {
          order: { $ref: "#/components/schemas/Order" },
          items: {
            type: "array" as const,
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          payment: { $ref: "#/components/schemas/Payment" },
        },
      },
      CreateOrderRequest: {
        type: "object" as const,
        required: ["items", "payment_method_id"],
        properties: {
          items: {
            type: "array" as const,
            minItems: 1,
            items: {
              type: "object" as const,
              required: ["ticket_type_id", "quantity"],
              properties: {
                ticket_type_id: { type: "string" as const, format: "uuid", example: "550e8400-e29b-41d4-a716-446655440010" },
                quantity: { type: "integer" as const, minimum: 1, example: 2 },
              },
            },
          },
          promo_code: { type: "string" as const, description: "Optional promo code", example: "TIKET10" },
          payment_method_id: { type: "string" as const, format: "uuid", example: "550e8400-e29b-41d4-a716-446655440020" },
        },
      },
      // ── Payment Schemas ───────────────────────────────────
      WebhookRequest: {
        type: "object" as const,
        required: ["order_id", "status"],
        properties: {
          order_id: { type: "string" as const, format: "uuid", example: "550e8400-e29b-41d4-a716-446655440030" },
          status: { type: "string" as const, enum: ["success", "failed"], example: "success" },
        },
      },
      WebhookResponse: {
        type: "object" as const,
        properties: {
          message: { type: "string" as const, example: "Webhook processed" },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Events", description: "Event management" },
    { name: "Tickets", description: "Ticket type management" },
    { name: "Orders", description: "Order management" },
    { name: "Payments", description: "Payment management" },
  ],
  paths: {
    // ── Auth ───────────────────────────────────────────────
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Create a new user account. A verification code will be sent to the provided email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: {
                          example:
                            "Registrasi berhasil. Silakan verifikasi email Anda.",
                        },
                        data: {
                          $ref: "#/components/schemas/SafeUser",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error or email already registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description:
          "Authenticate with email and password. Returns user data and JWT token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Login berhasil" },
                        data: {
                          $ref: "#/components/schemas/LoginResponse",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        description: "Returns the authenticated user's profile data.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: {
                          $ref: "#/components/schemas/SafeUser",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - token missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email address",
        description:
          "Verify user email with the 6-digit code sent during registration.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VerifyEmailRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Email verified successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: {
                          example: "Email berhasil diverifikasi",
                        },
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Invalid or expired verification code",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/resend-verification": {
      post: {
        tags: ["Auth"],
        summary: "Resend verification code",
        description:
          "Resend a new 6-digit verification code to the user's email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResendVerificationRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Verification code resent",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: {
                          example:
                            "Kode verifikasi baru telah dikirim",
                        },
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Email not found or already verified",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset",
        description:
          "Send a 6-digit password reset code to the user's email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ForgotPasswordRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reset code sent",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: {
                          example:
                            "Kode reset password telah dikirim ke email",
                        },
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Email not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description:
          "Reset user password using the 6-digit code from forgot-password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: {
                          example: "Password berhasil direset",
                        },
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Invalid or expired reset code",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    // ── Events ─────────────────────────────────────────────
    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "List published events",
        description: "Get a paginated list of published events. Supports search by title and filter by category.",
        parameters: [
          {
            name: "search",
            in: "query" as const,
            description: "Search events by title",
            schema: { type: "string" as const },
            example: "konser",
          },
          {
            name: "category_id",
            in: "query" as const,
            description: "Filter by category UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
          {
            name: "page",
            in: "query" as const,
            description: "Page number (default: 1)",
            schema: { type: "integer" as const, minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query" as const,
            description: "Items per page (default: 10, max: 50)",
            schema: { type: "integer" as const, minimum: 1, maximum: 50, default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of events",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: {
                          type: "object" as const,
                          properties: {
                            items: {
                              type: "array" as const,
                              items: { $ref: "#/components/schemas/EventListItem" },
                            },
                            pagination: { $ref: "#/components/schemas/Pagination" },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Events"],
        summary: "Create a new event",
        description: "Create a new event. Requires admin role.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateEventRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Event created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Event berhasil dibuat" },
                        data: { $ref: "#/components/schemas/EventDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized - token missing or invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Forbidden - admin role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Category or venue not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get event detail",
        description: "Get event detail with nested category, venue, and ticket types.",
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Event detail",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: { $ref: "#/components/schemas/EventDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Events"],
        summary: "Update an event",
        description: "Update event fields. Requires admin role. All fields are optional.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateEventRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Event updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Event berhasil diupdate" },
                        data: { $ref: "#/components/schemas/EventDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Forbidden - admin role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Event, category, or venue not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Events"],
        summary: "Delete an event (soft delete)",
        description: "Soft delete an event by setting deleted_at. Requires admin role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Event deleted successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Event berhasil dihapus" },
                        data: { nullable: true, example: null },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Forbidden - admin role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    // ── Tickets ────────────────────────────────────────────
    "/api/events/{eventId}/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "List ticket types for an event",
        description: "Get all ticket types for a specific event.",
        parameters: [
          {
            name: "eventId",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "List of ticket types",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: {
                          type: "array" as const,
                          items: { $ref: "#/components/schemas/TicketType" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Create a ticket type",
        description: "Create a new ticket type for an event. Requires admin role.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "eventId",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTicketRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Ticket type created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: { $ref: "#/components/schemas/TicketType" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Forbidden - admin role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/events/{eventId}/tickets/{id}": {
      put: {
        tags: ["Tickets"],
        summary: "Update a ticket type",
        description: "Update ticket type fields. Requires admin role. All fields are optional.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "eventId",
            in: "path" as const,
            required: true,
            description: "Event UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Ticket type UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTicketRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Ticket type updated successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: { $ref: "#/components/schemas/TicketType" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Forbidden - admin role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Event or ticket type not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    // ── Orders ─────────────────────────────────────────────
    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        description: "Create a new order with ticket items. Validates stock, applies promo code, calculates admin fee, and creates payment record. Order expires in 15 minutes.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Order berhasil dibuat" },
                        data: { $ref: "#/components/schemas/OrderDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error, insufficient stock, invalid promo code, or inactive payment method",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Ticket type or event not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Orders"],
        summary: "List user's orders",
        description: "Get a paginated list of the authenticated user's orders.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query" as const,
            description: "Page number (default: 1)",
            schema: { type: "integer" as const, minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query" as const,
            description: "Items per page (default: 10, max: 50)",
            schema: { type: "integer" as const, minimum: 1, maximum: 50, default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of orders",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: {
                          type: "object" as const,
                          properties: {
                            items: {
                              type: "array" as const,
                              items: { $ref: "#/components/schemas/Order" },
                            },
                            pagination: { $ref: "#/components/schemas/Pagination" },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order detail",
        description: "Get order detail with items and payment information.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Order UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Order detail",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: { $ref: "#/components/schemas/OrderDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/orders/{id}/cancel": {
      post: {
        tags: ["Orders"],
        summary: "Cancel an order",
        description: "Cancel an order. Only orders with status 'pending' or 'waiting_payment' can be cancelled. Restores ticket stock and promo usage.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path" as const,
            required: true,
            description: "Order UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Order cancelled successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Order berhasil dibatalkan" },
                        data: { $ref: "#/components/schemas/OrderDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Order cannot be cancelled (wrong status)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    // ── Payments ───────────────────────────────────────────
    "/api/payments/{orderId}/confirm": {
      post: {
        tags: ["Payments"],
        summary: "Confirm payment",
        description: "Simulate payment confirmation. Order must be in 'waiting_payment' status and not expired.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path" as const,
            required: true,
            description: "Order UUID",
            schema: { type: "string" as const, format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Payment confirmed successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        message: { example: "Pembayaran berhasil dikonfirmasi" },
                        data: { $ref: "#/components/schemas/OrderDetail" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Order not in waiting_payment status or expired",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Order or payment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/payments/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Payment gateway webhook",
        description: "Simulate payment gateway callback. No authentication required. Processes payment success or failure.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/WebhookRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook processed",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/SuccessResponse" },
                    {
                      type: "object" as const,
                      properties: {
                        data: { $ref: "#/components/schemas/WebhookResponse" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error or order not in correct status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Order or payment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export default openApiSpec;
