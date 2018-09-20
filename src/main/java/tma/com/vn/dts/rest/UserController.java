package tma.com.vn.dts.rest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tma.com.vn.dts.model.UserEntity;
import tma.com.vn.dts.service.UserService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "",method = RequestMethod.GET,produces = { "application/json" })
    public List<UserEntity> getAll() {
        return userService.getAll();
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET,produces = { "application/json" })
    public UserEntity getById(@PathVariable("id") Long id) {
        return userService.getById(id);
    }
}
