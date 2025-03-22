package com.work.restaurant.Filters;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class JwtFilter implements Filter {
    private static final String AUTH0_DOMAIN = "your-auth0-domain";
    private static final String AUDIENCE = "https://restaurant-api/";
    private static final String ISSUER = "https://" + AUTH0_DOMAIN + "/";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String token = getTokenFromHeader(httpRequest);

        if (token == null || !validateToken(token)) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.none(); // Auth0 сам перевіряє підпис
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .withAudience(AUDIENCE)
                    .build();
            DecodedJWT jwt = verifier.verify(token);

            // Перевірка ролі
            String[] roles = jwt.getClaim("https://your-app.com/roles").asArray(String.class);
            if (roles == null || !java.util.Arrays.asList(roles).contains("worker")) {
                return false;
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

