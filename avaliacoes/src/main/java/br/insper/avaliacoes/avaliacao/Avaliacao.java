package br.insper.avaliacoes.avaliacao;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emailAvaliador;

    @NotBlank(message = "email do avaliado é obrigatório")
    @Email(message = "email do avaliado inválido")
    private String emailAvaliado;

    @Size(max = 1000)
    private String comentarios;

    @NotNull(message = "nota é obrigatória")
    @Min(value = 0, message = "nota mínima é 0")
    @Max(value = 10, message = "nota máxima é 10")
    private Integer nota;

    private LocalDateTime dataAvaliacao;
}