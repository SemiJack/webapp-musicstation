package bada_project.SpringApplication.controller;

import bada_project.SpringApplication.dao.AddressDAO;
import bada_project.SpringApplication.dao.EmployeeDAO;
import bada_project.SpringApplication.dao.JobpositionDAO;
import bada_project.SpringApplication.model.Address;
import bada_project.SpringApplication.model.Employee;
import bada_project.SpringApplication.model.Jobposition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class EmployeeController {
    @Autowired
    private EmployeeDAO employeeDAO;
    @Autowired
    private AddressDAO addressDAO;
    @Autowired
    private JobpositionDAO jobpositionDAO;

    @RequestMapping(value = {"/employees/add/save", "/employees/update/save"}, method = RequestMethod.POST)
    public String save(@ModelAttribute("employee") Employee employee) {
        employeeDAO.saveOrUpdate(employee);
        return "redirect:/employees/show";
    }

    @RequestMapping(value = {"/employee/update/saveme"}, method = RequestMethod.POST)
    public String saveme(@ModelAttribute("employee") Employee employee) {
        employeeDAO.saveOrUpdate(employee);
        return "redirect:/employee/show/employee";
    }

    @RequestMapping("/employees/add")
    public String addEmployee(Model model) {
        Employee employee = new Employee();
        employee.setNr_rozglosni(1);
        List<Address> addresses = addressDAO.getAll();
        List<Jobposition> jobpositions = jobpositionDAO.getAll();
        Address newaddress = new Address();
        model.addAttribute("newaddress", newaddress);
        model.addAttribute("jobpositions", jobpositions);
        model.addAttribute("addresses", addresses);
        model.addAttribute("employee", employee);
        return "employees/add-employees";
    }

    @RequestMapping("/employees/add/address")
    public String addAddressForEmployee(Model model) {
        Address newaddress = new Address();
        model.addAttribute("newaddress", newaddress);
        return "employees/add/address";
    }

    @RequestMapping("/employees/add/address/save")
    public String saveAddAddressForEmployee(@ModelAttribute("address") Address address) {
        addressDAO.saveOrUpdate(address);
        return "redirect:/employees/add";
    }


    @RequestMapping("/employees/show")
    public String viewTableEmployees(Model model) {
        List<Employee> employees = employeeDAO.getAll();
        List<Address> addresses = addressDAO.getAll();
        List<Jobposition> jobpositions = jobpositionDAO.getAll();
        model.addAttribute("jobpositions", jobpositions);
        model.addAttribute("addresses", addresses);
        model.addAttribute("employees", employees);
        return "employees/show-employees";
    }

    @RequestMapping("/employees/delete")
    public String viewDeleteTableEmployees(Model model) {
        List<Employee> employees = employeeDAO.getAll();
        List<Address> addresses = addressDAO.getAll();
        List<Jobposition> jobpositions = jobpositionDAO.getAll();
        model.addAttribute("jobpositions", jobpositions);
        model.addAttribute("addresses", addresses);
        model.addAttribute("employees", employees);
        return "employees/delete-employees";
    }

    @RequestMapping(value = "/employee/show/{user}")
    public ModelAndView viewEmployee(@PathVariable(name = "user") String user) {
        ModelAndView mav = new ModelAndView("/employee/show-employee");
        List<Address> addresses = addressDAO.getAll();
        List<Jobposition> jobpositions = jobpositionDAO.getAll();
        mav.addObject("jobpositions", jobpositions);
        mav.addObject("addresses", addresses);
        List<Employee> employee = new ArrayList<>();
        employee.add(employeeDAO.getByName(user));
        mav.addObject("employees", employee);
        return mav;
    }

    @RequestMapping(value = {"/employees/update/{id}", "/employee/update/{id}"})
    public ModelAndView updateEmployee(@PathVariable(name = "id") int id) {
        ModelAndView mav = new ModelAndView("/employees/update-employees");
        Employee employee = employeeDAO.get(id);
        List<Address> addresses = addressDAO.getAll();
        List<Jobposition> jobpositions = jobpositionDAO.getAll();
        mav.addObject("jobpositions", jobpositions);
        mav.addObject("addresses", addresses);
        mav.addObject("employees", employee);
        return mav;
    }

    @RequestMapping("/employees/delete/{id}")
    public String deleteEmployee(@PathVariable(name = "id") int id) {
        try {
            employeeDAO.delete(id);
        } catch (DataAccessException e) {
            return "redirect:/errors/foundconnection";
        }
        return "redirect:/employees/delete";
    }
}

