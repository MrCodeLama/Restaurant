package com.work.restaurant.Servlets;

import com.google.gson.Gson;
import com.work.restaurant.Model.OrderItem;
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

@WebServlet(name = "TableOrderDetailsServlet", urlPatterns = "/table-order-details")
public class TableOrderDetailsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

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

        List<OrderItem> orderItems = new ArrayList<>();
        String orderQuery = """
                SELECT mi.name, oi.quantity, mi.price
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
                    orderItems.add(new OrderItem(rs.getString("name"), rs.getInt("quantity"), rs.getDouble("price")));
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
}

