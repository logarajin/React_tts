import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.saml2.provider.service.registration.*;
import org.springframework.security.saml2.credentials.Saml2X509Credential;
import org.springframework.security.web.SecurityFilterChain;

import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/").permitAll()
        .anyRequest().authenticated())
      .saml2Login(withDefaults -> {})
      .logout(l -> l.logoutSuccessUrl("/"));
    return http.build();
  }

  @Bean
  RelyingPartyRegistrationRepository relyingPartyRegistrationRepository() throws Exception {
    // Load SP private key + cert for decryption
    var ks = KeyStore.getInstance("PKCS12");
    ks.load(new ClassPathResource("sp-keystore.p12").getInputStream(),
            "changeit".toCharArray());
    var key = (PrivateKey) ks.getKey("sp-decrypt", "changeit".toCharArray());
    var cert = (X509Certificate) ks.getCertificate("sp-decrypt");

    Saml2X509Credential decryption = Saml2X509Credential.decryption(key, cert);

    // Build from Entra metadata (verification certs auto-loaded)
    RelyingPartyRegistration registration =
      RelyingPartyRegistrations
        .fromMetadataLocation("https://login.microsoftonline.com/<TENANT_ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<APP_ID>")
        .registrationId("entra")
        .entityId("urn:your-sp:example")
        .assertionConsumerServiceLocation("https://your-sp.example.com/login/saml2/sso/entra")
        .decryptionX509Credentials(creds -> creds.add(decryption))
        // (Optional) sign AuthnRequests if Entra requires it:
        // .signingX509Credentials(creds -> creds.add(Saml2X509Credential.signing(key, cert)))
        .build();

    return new InMemoryRelyingPartyRegistrationRepository(registration);
  }
}
