<<<<<<< HEAD
package com.artemiscore.artemiscore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String exibirPaginaLogin(){
        return "login"; // Retorna o arquivo login.html dentro de frontend
    }
}
=======
package com.artemiscore.artemiscore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String exibirPaginaLogin(){
        return "login"; // Retorna o arquivo login.html dentro de frontend
    }
}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
