package com.work.restaurant.Model;

public class RestaurantTable {
    private int id;
    private int number;
    private boolean hasOrder;

    public RestaurantTable() {
    }

    public RestaurantTable(int id, int number, boolean hasOrder) {
        this.id = id;
        this.number = number;
        this.hasOrder = hasOrder;
    }

    public boolean isHasOrder() {
        return hasOrder;
    }

    public void setHasOrder(boolean hasOrder) {
        this.hasOrder = hasOrder;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
