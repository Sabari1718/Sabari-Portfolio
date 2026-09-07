"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const social_controller_1 = require("../controllers/social.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(social_controller_1.getSocialLinks)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, social_controller_1.createSocialLink);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, social_controller_1.updateSocialLink)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, social_controller_1.deleteSocialLink);
exports.default = router;
//# sourceMappingURL=social.routes.js.map