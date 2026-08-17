package com.carbonlens.repository;

import com.carbonlens.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {

    List<Bill> findByUserIdOrderByUploadedAtDesc(String userId);

    List<Bill> findByUserIdOrderByBillDateDesc(String userId);

    Long countByUserId(String userId);

    List<Bill> findByUserIdAndBillDateBetween(String userId, LocalDate start, LocalDate end);

    @Aggregation(pipeline = {
        "{ '$match': { 'userId': ?0 } }",
        "{ '$group': { '_id': '$billType', 'total': { '$sum': '$co2Emitted' } } }"
    })
    List<org.bson.Document> getBreakdownByType(String userId);

    @Aggregation(pipeline = {
        "{ '$match': { 'userId': ?0 } }",
        "{ '$project': { 'month': { '$month': '$billDate' }, 'year': { '$year': '$billDate' }, 'co2Emitted': 1 } }",
        "{ '$group': { '_id': { 'month': '$month', 'year': '$year' }, 'total': { '$sum': '$co2Emitted' } } }",
        "{ '$sort': { '_id.year': -1, '_id.month': -1 } }"
    })
    List<org.bson.Document> getMonthlyTrend(String userId);

    Optional<Bill> findByIdAndUserId(String id, String userId);
}
