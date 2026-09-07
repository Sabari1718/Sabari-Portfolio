"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certification_controller_1 = require("../controllers/certification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(certification_controller_1.getCertifications)
    .post(auth_middleware_1.protect, auth_middleware_1.admin, certification_controller_1.createCertification);
router.route('/:id')
    .put(auth_middleware_1.protect, auth_middleware_1.admin, certification_controller_1.updateCertification)
    .delete(auth_middleware_1.protect, auth_middleware_1.admin, certification_controller_1.deleteCertification);
exports.default = router;
//# sourceMappingURL=certification.routes.js.map