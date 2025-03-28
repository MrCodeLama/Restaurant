package com.work.restaurant.Servlets;

import com.google.gson.Gson;
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
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/update-order")
public class UpdateOrderServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        try (BufferedReader reader = request.getReader()) {
            String json = reader.lines().collect(Collectors.joining());
            Gson gson = new Gson();
            OrderUpdateRequest orderUpdate = gson.fromJson(json, OrderUpdateRequest.class);

            try (Connection conn = DBUtil.getConnection()) {
                for (OrderItem item : orderUpdate.getItems()) {
                    if (item.getQuantity() > 0) {
                        String updateQuery = "UPDATE orderitem SET quantity = ? WHERE id = ?";
                        try (PreparedStatement stmt = conn.prepareStatement(updateQuery)) {
                            stmt.setInt(1, item.getQuantity());
                            stmt.setInt(2, item.getId());
                            stmt.executeUpdate();
                        }
                    } else {
                        String deleteQuery = "DELETE FROM orderitem WHERE id = ?";
                        try (PreparedStatement stmt = conn.prepareStatement(deleteQuery)) {
                            stmt.setInt(1, item.getId());
                            stmt.executeUpdate();
                        }
                    }
                }

                if (orderUpdate.getNewItems() != null) {
                    for (OrderItem newItem : orderUpdate.getNewItems()) {
                        String insertQuery = "INSERT INTO orderitem (order_id, name, quantity) VALUES (?, ?, ?)";
                        try (PreparedStatement stmt = conn.prepareStatement(insertQuery)) {
                            stmt.setInt(1, orderUpdate.getOrderId());
                            stmt.setString(2, newItem.getName());
                            stmt.setInt(3, newItem.getQuantity());
                            stmt.executeUpdate();
                        }
                    }
                }

                response.getWriter().write("{\"success\": true}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Не вдалося оновити замовлення\"}");
        }
    }

    private static class OrderUpdateRequest {
        private int orderId;
        private List<OrderItem> items;
        private List<OrderItem> newItems;

        public int getOrderId() { return orderId; }
        public List<OrderItem> getItems() { return items; }
        public List<OrderItem> getNewItems() { return newItems; }
    }

    private static class OrderItem {
        private int id;
        private String name;
        private int quantity;

        public int getId() { return id; }
        public String getName() { return name; }
        public int getQuantity() { return quantity; }
    }
}
