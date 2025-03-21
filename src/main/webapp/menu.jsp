<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List, com.work.restaurant.Model.MenuItem" %>
<html>
<head>
    <title>Меню</title>
</head>
<body>
<h2>Меню ресторану</h2>
<table border="1">
    <tr>
        <th>Назва</th>
        <th>Опис</th>
        <th>Ціна</th>
    </tr>
    <%
        List<MenuItem> menuItems = (List<MenuItem>) request.getAttribute("menuItems");
        for (MenuItem item : menuItems) {
    %>
    <tr>
        <td><%= item.getName() %></td>
        <td><%= item.getDescription() %></td>
        <td><%= item.getPrice() %> грн</td>
    </tr>
    <% } %>
</table>
</body>
</html>
