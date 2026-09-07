"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public route to submit messages
router.route('/')
    .post(contact_controller_1.submitContactMessage)
    .get(auth_middleware_1.protect, auth_middleware_1.admin, contact_controller_1.getContactMessages);
router.route('/:id/read')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, contact_controller_1.markMessageAsRead);
router.route('/:id')
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, contact_controller_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map