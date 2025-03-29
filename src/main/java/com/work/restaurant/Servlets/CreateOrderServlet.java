package com.work.restaurant.Servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.work.restaurant.Utils.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

@WebServlet(name = "CreateOrderServlet", urlPatterns = "/create-order")
public class CreateOrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        Gson gson = new Gson();
        JsonObject json = gson.fromJson(sb.toString(), JsonObject.class);

        int tableId = json.get("tableId").getAsInt();
        List<JsonObject> menuItems = gson.fromJson(json.getAsJsonArray("menuItemIds"), new TypeToken<List<JsonObject>>(){}.getType());

        try (Connection conn = DBUtil.getConnection()) {
            String insertOrderQuery = "INSERT INTO customerorder (restauranttable) VALUES (?)";
            int orderId;

            try (PreparedStatement stmt = conn.prepareStatement(insertOrderQuery, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setInt(1, tableId);
                stmt.executeUpdate();
                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        orderId = rs.getInt(1);
                    } else {
                        throw new Exception("Не вдалося отримати ID замовлення.");
                    }
                }
            }

            for (JsonObject item : menuItems) {
                int menuItemId = item.get("menuItemId").getAsInt();
                int quantity = item.get("quantity").getAsInt();

                String insertOrderItemQuery = "INSERT INTO orderitem (order_id, menu_item_id, quantity) VALUES (?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(insertOrderItemQuery)) {
                    stmt.setInt(1, orderId);
                    stmt.setInt(2, menuItemId);
                    stmt.setInt(3, quantity);
                    stmt.executeUpdate();
                }
            }

            JsonObject jsonResponse = new JsonObject();
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("orderId", orderId);
            response.getWriter().write(jsonResponse.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Не вдалося створити замовлення: " + e.getMessage() + "\"}");
        }
    }
}
