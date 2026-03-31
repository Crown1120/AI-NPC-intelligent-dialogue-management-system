package com.gameai.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/npc")
public class NpcController {

    @Value("${agent.python-url}")
    private String pythonAgentUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        String url = pythonAgentUrl + "/chat";
        try {
            Object response = restTemplate.postForObject(url, request, Object.class);
            return ResponseEntity.ok(response);
        } catch (RestClientResponseException e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(e.getRawStatusCode()))
                .body(Map.of("error", e.getResponseBodyAsString()));
        } catch (Exception e) {
            String message = e.getMessage() == null ? e.getClass().getName() : e.getMessage();
            return ResponseEntity.status(502).body(Map.of("error", message));
        }
    }

    @PostMapping("/task")
    public ResponseEntity<?> task(@RequestBody Map<String, Object> request) {
        String url = pythonAgentUrl + "/task";
        try {
            Object response = restTemplate.postForObject(url, request, Object.class);
            return ResponseEntity.ok(response);
        } catch (RestClientResponseException e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(e.getRawStatusCode()))
                .body(Map.of("error", e.getResponseBodyAsString()));
        } catch (Exception e) {
            String message = e.getMessage() == null ? e.getClass().getName() : e.getMessage();
            return ResponseEntity.status(502).body(Map.of("error", message));
        }
    }

    @GetMapping("/{npcId}/config")
    public ResponseEntity<?> getConfig(@PathVariable String npcId) {
        // Mocking config for now
        return ResponseEntity.ok(Map.of("npcId", npcId, "name", "Guard", "personality", "Strict but fair"));
    }

    @PutMapping("/{npcId}/config")
    public ResponseEntity<?> updateConfig(@PathVariable String npcId, @RequestBody Map<String, Object> config) {
        // Mocking update for now
        return ResponseEntity.ok(Map.of("status", "updated", "npcId", npcId));
    }
}
