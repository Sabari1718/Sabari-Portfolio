"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const experience_routes_1 = __importDefault(require("./routes/experience.routes"));
const education_routes_1 = __importDefault(require("./routes/education.routes"));
const certification_routes_1 = __importDefault(require("./routes/certification.routes"));
const social_routes_1 = __importDefault(require("./routes/social.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const navbar_routes_1 = __importDefault(require("./routes/navbar.routes"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create Express application
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enables Cross-Origin Resource Sharing (allows frontend to talk to backend)
app.use(express_1.default.json()); // Parses incoming JSON requests
// Serve static files from the uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/skills', skill_routes_1.default);
app.use('/api/experience', experience_routes_1.default);
app.use('/api/education', education_routes_1.default);
app.use('/api/certifications', certification_routes_1.default);
app.use('/api/social-links', social_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/navbar', navbar_routes_1.default);
// Health check endpoint (Phase 1)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Sabari Portfolio API is running'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map