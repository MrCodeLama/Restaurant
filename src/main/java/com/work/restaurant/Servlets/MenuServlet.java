package com.work.restaurant.Servlets;

import com.work.restaurant.Model.Category;
import com.work.restaurant.Model.MenuItem;
import com.work.restaurant.Utils.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "MenuServlet", urlPatterns = "/menu")
public class MenuServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<MenuItem> menuItems = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM MenuItem");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                MenuItem item = new MenuItem();
                item.setId(rs.getInt("id"));
                item.setName(rs.getString("name"));
                item.setDescription(rs.getString("description"));
                item.setPrice(rs.getDouble("price"));
                item.setCategory(Category.valueOf(rs.getString("category")));

                menuItems.add(item);
            }

        } catch (Exception e) {
            throw new ServletException("Помилка отримання меню", e);
        }

        request.setAttribute("menuItems", menuItems);
        request.getRequestDispatcher("/menu.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }
}
