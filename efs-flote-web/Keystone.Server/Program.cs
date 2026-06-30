using GemBox.Spreadsheet;
using Keystone.DAL.Provider;
using Keystone.DAL.Utility;
using Keystone.Server.Utility.ExceptionHandler;
using Keystone.Services.Services.Admin;
using Keystone.Services.Services.Bills;
using Keystone.Services.Services.Email;
using Keystone.Services.Services.Filters;
using Keystone.Services.Services.Locations.LocationOceanMBL;
using Keystone.Services.Services.Locations.LocationShipment;
using Keystone.Services.Services.MBL.OceanMBL;
using Keystone.Services.Services.MultiUpload;
using Keystone.Services.Services.Reports;
using Keystone.Services.Services.Session;
using Keystone.Services.Services.Shipment;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ✅ LOAD BASE CONFIGURATION (will be overridden by middleware on first request)
builder.Configuration.Sources.Clear();
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.Development.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

SpreadsheetInfo.SetLicense("SN-2020Sep29-kclyZ71N54sv1IpAN0q0+4O2VVYg4osToSJpoA8R3pSHUcB/ccD+vE+F07oXO2YXXRyglncfYiNpYPT0blDfsqLiHlg==A");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options =>
    {
        // ✅ DYNAMIC AUDIENCE VALIDATION
        options.TokenValidationParameters.AudienceValidator = (audiences, securityToken, validationParameters) =>
        {
            // The first audience in the token is the one we want to validate.
            var tokenAudience = audiences.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(tokenAudience))
            {
                return false; // No audience in token
            }

            // Get the expected audience from the correctly initialized ConfigurationHelper.
            var expectedAudience = ConfigurationHelper.Configuration.GetValue<string>("AzureAd:Audience");

            // Compare the token's audience with the expected audience for the current environment.
            return tokenAudience.Equals(expectedAudience, StringComparison.Ordinal);
        };

        // We are using a custom AudienceValidator, so set ValidateAudience to false to prevent the default check.
        options.TokenValidationParameters.ValidateAudience = false;

    }, options =>
    {
        builder.Configuration.Bind("AzureAd", options);
    });

builder.Services.AddAuthorization(config =>
{
    config.AddPolicy("AuthZPolicy", policyBuilder =>
        policyBuilder.Requirements.Add(new ScopeAuthorizationRequirement() { RequiredScopesConfigurationKey = $"AzureAd:Scopes" }));
});

builder.Services.AddMemoryCache();

// Register services
builder.Services.AddScoped<IDataProvider, DataProvider>();
builder.Services.AddScoped<IDataWrapper, DataWrapper>();
builder.Services.AddScoped<IMultiUploadService, MultiUploadService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IEmailConfigService, EmailConfigService>();
builder.Services.AddScoped<IEmailNotificationConfigService, EmailNotificationConfigService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ILocationShipmentService, LocationShipmentService>();
builder.Services.AddScoped<IShipmentService, ShipmentService>();
// Named HttpClient for BIASecurity server-to-server calls (api/user/User)
builder.Services.AddHttpClient("BIASecurity");
builder.Services.AddScoped<IFilterService, FilterService>();
builder.Services.AddScoped<ILocationOceanMBLService, LocationOceanMBLService>();
builder.Services.AddScoped<IOceanMBLService, OceanMBLService>();
//Repositories
builder.Services.AddScoped<IBillsService, BillsService>();
// Logging with Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
builder.Logging.ClearProviders();
builder.Host.UseSerilog();

// Swagger & CORS
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ApiCorsPolicy", builder =>
    {
        builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader().WithExposedHeaders("Content-Disposition");
    });
});

// Exception handling
builder.Services.AddExceptionHandler<NotImplementedExceptionHandler>();
builder.Services.AddExceptionHandler<BadRequestnHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddControllers(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("ApiCorsPolicy");

// ✅ DETECT ENVIRONMENT FROM REQUEST URL AND INITIALIZE CONFIGURATION
string detectedEnvironment = "Development"; // Default
bool vaultInitialized = false;

app.Use(async (context, next) =>
{
    var host = context.Request.Host.Host.ToLower();

    // ✅ FIX: Check more specific domains first (alpha, testnet) before generic production
    if (host.Contains("localhost"))
        detectedEnvironment = "Development";
    else if (host.Contains("biaalpha") || host.Contains("alpha"))
        detectedEnvironment = "Alpha";
    else if (host.Contains("ams1907") || host.Contains("biadev"))
        detectedEnvironment = "TestNet";
    else if (host.Contains("bia.inside.ups.com"))
        detectedEnvironment = "Production";

    // Initialize ConfigurationHelper if not already initialized
    if (!ConfigurationHelper.IsInitialized)
    {
        Console.WriteLine($"[STARTUP] Detected Environment from URL: {detectedEnvironment} (Host: {host})");
        ConfigurationHelper.Initialize(detectedEnvironment);

        // Vault initialization (only once)
        if (!vaultInitialized)
        {
            await Task.Run(() =>
            {
                try
                {
                    Hashicorp.TLSLogin(detectedEnvironment);
                    Console.WriteLine("Vault initialized at startup.");
                    vaultInitialized = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Vault initialization failed: " + ex.Message);
                }
            });
        }
    }

    await next();
});

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseExceptionHandler();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();