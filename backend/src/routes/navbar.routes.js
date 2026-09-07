"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const navbar_controller_1 = require("../controllers/navbar.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(navbar_controller_1.getNavbarSettings)
    .put(auth_middleware_1.protect, auth_middleware_1.admin, navbar_controller_1.updateNavbarSettings);
exports.default = router;
//# sourceMappingURL=navbar.routes.js.map