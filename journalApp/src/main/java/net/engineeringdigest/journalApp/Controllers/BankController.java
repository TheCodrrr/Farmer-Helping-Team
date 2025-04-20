package net.engineeringdigest.journalApp.Controllers;


import lombok.extern.slf4j.Slf4j;

import net.engineeringdigest.journalApp.Entities.BankEntity;
import net.engineeringdigest.journalApp.Entities.UserEntity;
import net.engineeringdigest.journalApp.Repositories.BankRepositary;

import net.engineeringdigest.journalApp.Repositories.UserRepository;
import net.engineeringdigest.journalApp.Services.BankService;
import net.engineeringdigest.journalApp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Bank")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class BankController {
	
	@Autowired
	private BankService bankService;


	@Autowired
	private BankRepositary bankRepositary;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserService userService;

	@GetMapping("/getBankInfo")
	public ResponseEntity<?> getUser(){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String name = authentication.getName();
			BankEntity user = bankRepositary.findByBankName(name);
			return new ResponseEntity<>(user, HttpStatus.OK);
		}
		catch (Exception e){
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
	}

	
	@GetMapping("/getAllFarmers")
	public ResponseEntity<?> getAllFarmers(){
		try{
			List<UserEntity> all = userService.getAll();
			return ResponseEntity.ok(all);
		}
		catch (Exception e){
			log.error("Error while fetching farmers",e);
			return ResponseEntity.badRequest().body("Error while fetching farmers");
		}
	}
	
	@PostMapping("/approveLoan")
	public ResponseEntity<?> approveLoan(@RequestBody UserEntity farmer){
		try{
			
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String loggedInBank = authentication.getName();
			if(loggedInBank!=null){
				bankService.approveLoan(loggedInBank,farmer);
				return new ResponseEntity<>(HttpStatus.ACCEPTED);
			}
			else{
				return ResponseEntity.badRequest().body("Bank not found");
			}
			
		}
		catch (Exception e){
			log.error("Error while approving loan",e);
			return ResponseEntity.badRequest().body("Error while approving loan");
		}
	}
	
	@PostMapping("/getCreditScore")
	public ResponseEntity<?> getCreditScore() {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String username = authentication.getName();
			UserEntity user = userRepository.findByName(username);
			
			if (user == null) {
				return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
			}
			
			// Create request payload with null checks and default values
			Map<String, Object> requestMap = new HashMap<>();
			requestMap.put("year", user.getYear() != null ? user.getYear() : "2024");
			requestMap.put("country", user.getCountry() != null ? user.getCountry() : "USA");
			requestMap.put("region", user.getRegion() != null ? user.getRegion() : "Midwest");
			requestMap.put("landSize", user.getLandSize() != 0 ? user.getLandSize() : 100.5);
			requestMap.put("soilType", user.getSoilType() != null ? user.getSoilType() : "Loamy");
			requestMap.put("pastYield", user.getPastYield() != 0 ? user.getPastYield() : 50.2);
			requestMap.put("cropTypes", user.getCropTypes() != null ? user.getCropTypes() : "Wheat");
			requestMap.put("annualIncome", user.getAnnualIncome() != 0 ? user.getAnnualIncome() : 50000);
			requestMap.put("soilPH", user.getSoilPH() != 0 ? user.getSoilPH() : 6.5);
			requestMap.put("nitrogenLevel", user.getNitrogenLevel() != 0 ? user.getNitrogenLevel() : 30);
			requestMap.put("organicMatterLevel", user.getOrganicMatterLevel() != 0 ? user.getOrganicMatterLevel() : 20);
			requestMap.put("landQualityScore", user.getLandQualityScore() != 0 ? user.getLandQualityScore() : 85);
			requestMap.put("pastRainfall", user.getPastRainfall() != 0 ? user.getPastRainfall() : 300.2);
			requestMap.put("avgTemperature", user.getAvgTemperature() != 0 ? user.getAvgTemperature() : 25.5);
			requestMap.put("creditScore", 0.0);
			
			// Log the request for debugging
			log.info("Sending request to credit score API: {}", requestMap);
			
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestMap, headers);
			
			try {
				ResponseEntity<Map> response = restTemplate.postForEntity(
						"https://creditscoreprediction-2ccj.onrender.com/predict",
						entity,
						Map.class
				);
				
				Map<String, Object> responseBody = response.getBody();
				log.info("API Response: {}", responseBody);
				
				// Check if response contains prediction key (the API might have a different structure)
				if (responseBody != null) {
					// Try to find the credit score in the response - could be under different keys
					Object creditScoreObj = responseBody.get("predicted_credit_score");
					if (creditScoreObj == null) {
						creditScoreObj = responseBody.get("prediction");
					}
					
					if (creditScoreObj != null) {
						float creditScore = Float.parseFloat(creditScoreObj.toString());
						user.setCreditScore(creditScore);
						user.setCreditScoreVerified(true);
						userRepository.save(user);
						
						return new ResponseEntity<>(creditScore, HttpStatus.OK);
					} else {
						log.warn("Credit score not found in response: {}", responseBody);
						return new ResponseEntity<>("Credit score not found in API response", HttpStatus.BAD_REQUEST);
					}
				} else {
					return new ResponseEntity<>("Empty response from credit score API", HttpStatus.BAD_REQUEST);
				}
			} catch (org.springframework.web.client.HttpClientErrorException ex) {
				log.error("API error response: {}", ex.getResponseBodyAsString());
				return new ResponseEntity<>("API error: " + ex.getStatusCode() + " - " + ex.getResponseBodyAsString(),
						HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			log.error("Error calculating credit score", e);
			return new ResponseEntity<>("Failed to calculate credit score: " + e.getMessage(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
