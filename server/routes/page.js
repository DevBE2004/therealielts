const router = require("express").Router();
const Joi = require("joi");
const ctrl = require("../controllers/pageController");
const { string, array, number } = require("../middlewares/joiSchema");
const validateInfo = require("../middlewares/validateInfo");
const {
  verifyToken,
  isEditor,
  isAdmin,
} = require("../middlewares/verifyToken");
const { parseJSONFields } = require("../middlewares/parseFormData");
const { upload } = require("../config/cloudinary");
const { antiSpam } = require("../middlewares/antiSpam");

router.use(antiSpam);
router.post(
  "/create",
  verifyToken,
  isEditor,
  upload.none(),
  validateInfo(
    Joi.object({
      icon: string,
      title: string,
      slug: string,
      children: array,
      orderIndex: number,
    })
  ),
  ctrl.create
);
router.put(
  "/update/:id",
  verifyToken,
  isEditor,
  upload.none(),
  validateInfo(
    Joi.object({
      icon: string,
      title: string,
      slug: string,
      children: array,
      orderIndex: number,
    })
  ),
  ctrl.update
);
router.delete("/delete/:id", verifyToken, isAdmin, ctrl.delete);
router.get("/:id", ctrl.getOne);
router.get("/", ctrl.getAll);

module.exports = router;
