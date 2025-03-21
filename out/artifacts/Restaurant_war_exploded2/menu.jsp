<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <title>Меню ресторану</title>
</head>
<body>
<h2>Меню</h2>
<table border="1">
    <tr>
        <th>Назва</th>
        <th>Опис</th>
        <th>Ціна</th>
        <th>Категорія</th>
    </tr>
    <c:forEach var="item" items="${menuItems}">
        <tr>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td>${item.category}</td>
        </tr>
    </c:forEach>
</table>
</body>
</html>
