"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(project_controller_1.getProjects)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.createProject);
router.route('/:slug')
    .get(project_controller_1.getProjectBySlug);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.updateProject)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.deleteProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map