"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experience_controller_1 = require("../controllers/experience.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(experience_controller_1.getExperiences)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, experience_controller_1.createExperience);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, experience_controller_1.updateExperience)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, experience_controller_1.deleteExperience);
exports.default = router;
//# sourceMappingURL=experience.routes.js.map