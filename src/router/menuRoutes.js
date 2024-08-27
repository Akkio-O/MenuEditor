const express = require("express");
const router = express.Router();
const con = require("../../db");

router.get("/menu_items", async (req, res) => {
  try {
    const [menu] = await con.query("SELECT * FROM menu_items");
    const [submenu] = await con.query("SELECT * FROM submenu_items");
    const [subsubmenu] = await con.query("SELECT * FROM subsubmenu_items");
    res.status(200).json({ menu, submenu, subsubmenu });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Не удалось загрузить меню" });
  }
});
router.post("/menu_items/save", async (req, res) => {
  const { menu } = req.body;
  const connection = await con.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM menu_items");
    await connection.query("DELETE FROM submenu_items");
    await connection.query("DELETE FROM subsubmenu_items");
	await connection.query("ALTER TABLE menu_items AUTO_INCREMENT = 1;");
	await connection.query("ALTER TABLE submenu_items AUTO_INCREMENT = 1;");
	await connection.query("ALTER TABLE subsubmenu_items AUTO_INCREMENT = 1;");
    const menuMap = new Map();
    for (const item of menu) {
      const [result] = await connection.query(
        "INSERT INTO menu_items (name) VALUES (?)",
        [item.name]
      );
      const menuItemId = result.insertId;
      menuMap.set(item.id, menuItemId);

      if (item.children) {
        for (const child of item.children) {
          const [childResult] = await connection.query(
            "INSERT INTO submenu_items (subname, menu_item_id) VALUES (?, ?)",
            [child.name, menuItemId]
          );
          const submenuItemId = childResult.insertId;
          for (const subChild of child.children) {
            await connection.query(
              "INSERT INTO subsubmenu_items (name, child_id, menu_items_id) VALUES (?, ?, ?)",
              [
                subChild.name,
                submenuItemId,
                menuMap.get(subChild.menu_items_id),
              ]
            );
          }
        }
      }
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
