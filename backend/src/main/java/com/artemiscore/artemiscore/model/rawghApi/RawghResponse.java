package com.artemiscore.artemiscore.model.rawghApi;

import java.util.List;

public class RawghResponse<T> {

    private List<T> results;

    public List<T> getResults() {
        return results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }
}
