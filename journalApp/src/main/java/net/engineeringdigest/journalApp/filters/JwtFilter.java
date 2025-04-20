package net.engineeringdigest.journalApp.filters;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Services.BankDetailsServiceImpl;
import net.engineeringdigest.journalApp.Services.UserDetailServiceImpl;
import net.engineeringdigest.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	@Qualifier("userDetailServiceImpl")
	private UserDetailServiceImpl userDetailsService;
	
	@Autowired
	@Qualifier("bankDetailsServiceImpl")
	private BankDetailsServiceImpl bankDetailsService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		try {
			String authorization = request.getHeader("Authorization");
			String username = null;
			String jwt = null;
			
			if (authorization != null && authorization.startsWith("Bearer ")) {
				jwt = authorization.substring(7);
				username = jwtUtil.extractUsername(jwt);
			}
			
			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = null;
				
				// Try to load from user service first
				try {
					userDetails = userDetailsService.loadUserByUsername(username);
				} catch (UsernameNotFoundException e) {
					// If not found in user service, try bank service
					try {
						userDetails = bankDetailsService.loadUserByUsername(username);
					} catch (UsernameNotFoundException ex) {
						log.warn("Username not found in either service: {}", username);
					}
				}
				
				if (userDetails != null && jwtUtil.validateToken(jwt)) {
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			
			filterChain.doFilter(request, response);
		} catch (Exception e) {
			log.error("Error while validating token", e);
			filterChain.doFilter(request, response);
		}
	}
}