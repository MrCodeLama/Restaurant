package com.work.restaurant.Filters;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Можна реалізувати ініціалізацію, якщо потрібно
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        System.out.println("CORS Filter triggered");

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        System.out.println("CORS Filter: Processing request for " + httpRequest.getRequestURI());


        // Додаємо заголовки для CORS
        httpResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Ваш фронтенд
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");


        // Якщо запит OPTIONS (попередній запит CORS), просто повертаємо 200 статус
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Продовжуємо обробку запиту
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Можна реалізувати очистку ресурсів, якщо потрібно
    }
}
