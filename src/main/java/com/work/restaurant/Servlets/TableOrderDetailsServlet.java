package com.work.restaurant.Servlets;

import com.google.gson.Gson;
import com.work.restaurant.Utils.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/table-order-details")
public class TableOrderDetailsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String tableIdParam = request.getParameter("tableId");
        if (tableIdParam == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Missing tableId parameter\"}");
            return;
        }

        int tableId;
        try {
            tableId = Integer.parseInt(tableIdParam);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid tableId\"}");
            return;
        }

        List<OrderItemDTO> orderItems = new ArrayList<>();
        String orderQuery = """
            SELECT mi.name, oi.quantity
            FROM orderitem oi
            JOIN menuitem mi ON oi.menu_item_id = mi.id
            JOIN customerorder o ON oi.order_id = o.id
            WHERE o.restauranttable = ?
        """;

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(orderQuery)) {
            stmt.setInt(1, tableId);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    orderItems.add(new OrderItemDTO(rs.getString("name"), rs.getInt("quantity")));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        String json = new Gson().toJson(orderItems);
        response.getWriter().write(json);
    }

    private static class OrderItemDTO {
        private String name;
        private int quantity;

        public OrderItemDTO(String name, int quantity) {
            this.name = name;
            this.quantity = quantity;
        }
    }
}

