"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const education_controller_1 = require("../controllers/education.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(education_controller_1.getEducation)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, education_controller_1.createEducation);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, education_controller_1.updateEducation)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, education_controller_1.deleteEducation);
exports.default = router;
//# sourceMappingURL=education.routes.js.map