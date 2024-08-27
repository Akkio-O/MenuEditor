const express = require("express");
const router = express.Router();
const con = require("../../db");

router.get("/menu_items", async (req, res) => {
  try {
    const [menu] = await con.query("SELECT * FROM menu_items");
    const [submenu] = await con.query("SELECT * FROM submenu_items");
    console.log(submenu);
    res.status(200).json({ menu, submenu });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Не удалось загрузить меню" });
  }
});
router.post("/menu_items/save", async (req, res) => {
  const { menu, children } = req.body;
  const connection = await con.getConnection();
  try {
    await connection.beginTransaction();
    let parentId;
    await connection.query("DELETE FROM menu_items");
    await connection.query("DELETE FROM submenu_items");
    await connection.query("ALTER TABLE menu_items AUTO_INCREMENT = 1;");
    await connection.query("ALTER TABLE submenu_items AUTO_INCREMENT = 1");
    for (const item of menu) {
      const [result] = await connection.query(
        "INSERT INTO menu_items (name) VALUES (?)",
        [item.name]
      );
      parentId = result.insertId;
      await connection.query(
        "UPDATE menu_items SET parent_id = ? WHERE id = ?",
        [parentId, parentId]
      );
    }
    for (const child of children) {
      await connection.query(
        "INSERT INTO submenu_items (subname, menu_item_id) VALUES (?, ?)",
        [child.name, child.menu_item_id]
      );
    }
    await connection.commit();
    res.status(200).json({ message: "Menu saved successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving menu:", error);
    res.status(500).json({ error: "Failed to save menu" });
  } finally {
    connection.release();
  }
});

module.exports = router;
