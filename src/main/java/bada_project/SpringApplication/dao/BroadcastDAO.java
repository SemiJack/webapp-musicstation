package bada_project.SpringApplication.dao;

import bada_project.SpringApplication.model.Broadcast;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class BroadcastDAO implements DAO<Broadcast> {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public BroadcastDAO(JdbcTemplate jdbcTemplate) {
        super();
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public Broadcast get(int id) {
        String sql = "SELECT * FROM audycje WHERE nr_audycji=" + id;
        return jdbcTemplate.queryForObject(sql, BeanPropertyRowMapper.newInstance(Broadcast.class));
    }

    @Override
    public List<Broadcast> getAll() {
        String sql = "SELECT * FROM AUDYCJE";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Broadcast.class));
    }


    @Override
    public void saveOrUpdate(Broadcast audycja) {
        // update
        if (audycja.getNr_audycji() > 0) {
            String sql = "UPDATE AUDYCJE SET DATA=?, FORMAT=?, CZAS_TRWANIA=?, NR_ROZGLOSNI=? WHERE NR_AUDYCJI=?";
            jdbcTemplate.update(sql, audycja.getData(), audycja.getFormat(), audycja.getCzas_trwania(), audycja.getNr_rozglosni(), audycja.getNr_audycji());
        } else {
            // insert
            String sql = "INSERT INTO audycje (DATA, FORMAT, CZAS_TRWANIA, NR_ROZGLOSNI) VALUES(?,?,?,?)";
            jdbcTemplate.update(sql, audycja.getData(), audycja.getFormat(), audycja.getCzas_trwania(), audycja.getNr_rozglosni());
        }
    }


    @Override
    public void delete(int id) {
        String sql = "DELETE FROM audycje WHERE nr_audycji=?";
        jdbcTemplate.update(sql, id);
    }
}
