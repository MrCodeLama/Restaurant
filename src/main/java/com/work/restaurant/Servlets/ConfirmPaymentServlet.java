package com.work.restaurant.Servlets;

import com.work.restaurant.Utils.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet(name = "ConfirmPaymentServlet", urlPatterns = "/confirm-payment")
public class ConfirmPaymentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");


        String tableIdParam = request.getParameter("tableId");

        if (tableIdParam == null || tableIdParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"tableId is required\"}");
            return;
        }

        int tableId = Integer.parseInt(tableIdParam);

        try (Connection conn = DBUtil.getConnection()) {
            String deleteOrderItemsQuery = "DELETE FROM orderitem WHERE order_id IN " +
                    "(SELECT id FROM customerorder WHERE restauranttable = ?)";
            try (PreparedStatement stmt = conn.prepareStatement(deleteOrderItemsQuery)) {
                stmt.setInt(1, tableId);
                stmt.executeUpdate();
            }

            String deleteOrderQuery = "DELETE FROM customerorder WHERE restauranttable = ?";
            try (PreparedStatement stmt = conn.prepareStatement(deleteOrderQuery)) {
                stmt.setInt(1, tableId);
                stmt.executeUpdate();
            }

            response.getWriter().write("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Не вдалося видалити замовлення\"}");
        }
    }
}