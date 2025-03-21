package com.work.restaurant.Utils;

import com.work.restaurant.Model.Category;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class MenuItemInserter {
    public static void main(String[] args) {
        String sql = "INSERT INTO MenuItem (name, description, price, category) VALUES (?, ?, ?, ?::category_type)";

        Object[][] testData = {
                {"Борщ", "Український традиційний суп", 120.50, Category.MAIN},
                {"Піца Маргарита", "Класична піца з томатами і моцарелою", 200.00, Category.MAIN},
                {"Кава", "Еспресо", 50.00, Category.DRINK},
                {"Чай", "Зелений чай", 40.00, Category.DRINK},
                {"Торт Наполеон", "Смачний торт з кремом", 150.00, Category.DESSERT}
        };

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            for (Object[] item : testData) {
                stmt.setString(1, (String) item[0]);
                stmt.setString(2, (String) item[1]);
                stmt.setDouble(3, (Double) item[2]);
                stmt.setString(4, ((Category) item[3]).name()); // Передаємо ENUM як рядок

                stmt.executeUpdate();
            }

            System.out.println("Тестові дані успішно додано!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
