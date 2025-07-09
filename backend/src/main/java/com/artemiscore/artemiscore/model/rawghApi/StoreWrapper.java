package com.artemiscore.artemiscore.model.rawghApi;

import lombok.Data;

@Data
public class StoreWrapper {
    private Long id;
    private String url;
    private StoreDTO store;
}
