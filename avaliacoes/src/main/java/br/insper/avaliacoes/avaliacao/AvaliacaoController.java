package br.insper.avaliacoes.avaliacao;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;

    @Value("${app.auth0.namespace}")
    private String namespace;

    public AvaliacaoController(AvaliacaoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Avaliacao cadastrar(@Valid @RequestBody Avaliacao avaliacao,
                               @AuthenticationPrincipal Jwt jwt) {
        String emailAvaliador = jwt.getClaimAsString(namespace + "email");
        return service.cadastrar(avaliacao, emailAvaliador);
    }

    @GetMapping
    public List<Avaliacao> listar() {
        return service.listar();
    }
}