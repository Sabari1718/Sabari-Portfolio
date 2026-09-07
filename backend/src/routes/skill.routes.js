"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skill_controller_1 = require("../controllers/skill.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(skill_controller_1.getSkills)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, skill_controller_1.createSkill);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, skill_controller_1.updateSkill)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, skill_controller_1.deleteSkill);
exports.default = router;
//# sourceMappingURL=skill.routes.js.map