const express = require("express");
const router = express.Router();
const con = require("../../db");

router.get("/menu_items", async (req, res) => {
  try {
    const [menu] = await con.query("SELECT * FROM menu_hierarchy");

    // Преобразование плоской структуры меню в иерархическую
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          id: item.id,
          title: item.title,
          isActive: !!item.is_active,
          parentId: item.parent_id,
          child: buildTree(items, item.id) // Рекурсивно находим дочерние элементы
        }));
    };

    // create иерархическую структуру меню
    const menuTree = buildTree(menu);

    // return иерархическую структуру меню клиенту
    res.status(200).json({ menu: menuTree });
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
    await connection.query("DELETE FROM menu_hierarchy");
    await connection.query("ALTER TABLE menu_hierarchy AUTO_INCREMENT = 1;");
    const insertMenuItems = async (items, parentId = null) => {
      for (const item of items) {
        const [result] = await connection.query(
          "INSERT INTO menu_hierarchy (title, parent_id) VALUES (?, ?)",
          [item.title, parentId]
        );
        const newItemId = result.insertId;

        if (item.child && item.child.length > 0) {
          await insertMenuItems(item.child, newItemId);
        }
      }
    };
    await insertMenuItems(menu);

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
