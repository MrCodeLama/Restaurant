package com.work.restaurant.Model;

public class RestaurantTable {
    private int id;
    private int number;

    public RestaurantTable() {
    }

    public RestaurantTable(int id, int number) {
        this.id = id;
        this.number = number;
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
