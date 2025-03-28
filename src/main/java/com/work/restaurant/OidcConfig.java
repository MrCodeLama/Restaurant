package com.work.restaurant;


import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class OidcConfig {

    private static final Logger LOGGER = Logger.getLogger(OidcConfig.class.getName());

    private String domain;
    private String clientId;
    private String clientSecret;
    private String issuerUri;

    public OidcConfig() {
        try {
            var properties = new Properties();
            properties.load(getClass().getResourceAsStream("/oidc.properties"));
            this.domain = properties.getProperty("domain");
            this.clientId = properties.getProperty("clientId");
            this.clientSecret = properties.getProperty("clientSecret");
            this.issuerUri = "https://" + this.domain + "/";
            LOGGER.log(Level.SEVERE, "OidcConfig: " + this);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to load oidc.properties", e);
        }
    }

    public String getDomain() {
        return domain;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getIssuerUri() {
        return issuerUri;
    }
}