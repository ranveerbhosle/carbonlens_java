package com.carbonlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private String id;
        private String name;
        private String email;
    }
}
