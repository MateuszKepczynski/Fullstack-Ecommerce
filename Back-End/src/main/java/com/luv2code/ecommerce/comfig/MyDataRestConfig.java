package com.luv2code.ecommerce.comfig;

import com.luv2code.ecommerce.entity.Country;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer
{

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config)
    {
        HttpMethod[] theUnsupportedMethods = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for Product
        disableHttpMethods(Product.class, config, theUnsupportedMethods);
        disableHttpMethods(ProductCategory.class, config, theUnsupportedMethods);
        disableHttpMethods(Country.class, config, theUnsupportedMethods);
        disableHttpMethods(State.class, config, theUnsupportedMethods);


        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedMethods)
    {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedMethods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedMethods));
    }

    private void exposeIds(RepositoryRestConfiguration config)
    {
        Set<EntityType<?>> entityTypeSet = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        entityTypeSet.forEach(entityType -> entityClasses.add(entityType.getJavaType()));

        Class[] domainType = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainType);
    }
}
