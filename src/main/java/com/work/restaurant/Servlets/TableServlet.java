package com.work.restaurant.Servlets;

import com.work.restaurant.Model.RestaurantTable;
import com.work.restaurant.Utils.DBUtil;
import com.google.gson.Gson;
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

@WebServlet(name = "TableServlet", urlPatterns = "/tables")
public class TableServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        List<RestaurantTable> tables = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM restauranttable");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                tables.add(new RestaurantTable(rs.getInt("id"), rs.getInt("table_number")));
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        String json = new Gson().toJson(tables);
        PrintWriter out = response.getWriter();
        out.print(json);
        out.flush();
    }
}
