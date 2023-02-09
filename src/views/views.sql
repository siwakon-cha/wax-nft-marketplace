CREATE OR REPLACE VIEW most_recent_trades AS 
WITH ranked_trades AS (
	SELECT author, category_id, name, image, buy_seq, price, usd_price, bundle, ROW_NUMBER() OVER (
		PARTITION BY author, category_id, name, image, bundle ORDER BY buy_seq DESC
	) as rn FROM trades t WHERE NOT bundle AND (author, category_id, name, image) IN (SELECT author, category_id, name, image FROM trades WHERE timestamp > (SELECT timestamp - INTERVAL '10 minutes' FROM last_updates WHERE type = 'averages'))
) SELECT * FROM ranked_trades WHERE rn <= 10 ORDER BY author, name, category_id;

CREATE OR REPLACE VIEW last_sold_items AS 
WITH ranked_trades AS (
 SELECT author, category_id, name, image, buy_seq, price, usd_price, bundle, ROW_NUMBER() OVER (
  PARTITION BY author, category_id, name, image ORDER BY buy_seq DESC
 ) as rn FROM trades t WHERE NOT bundle AND (author, category_id, name, image) IN (SELECT author, category_id, name, image FROM trades WHERE timestamp > (SELECT timestamp - INTERVAL '10 minutes' FROM last_updates WHERE type = 'averages'))
) SELECT * FROM ranked_trades WHERE rn <= 1 ORDER BY author, name, category_id;

CREATE OR REPLACE VIEW trade_totals AS 
SELECT author, name, image, category_id, COUNT(1) AS num_sales, SUM(price) AS revenue, SUM(usd_price) AS usd_revenue 
FROM trades WHERE NOT bundle AND (author, category_id, name, image) IN (SELECT author, category_id, name, image FROM trades WHERE timestamp > (SELECT timestamp - INTERVAL '10 minutes' FROM last_updates WHERE type = 'averages')) GROUP BY 1, 2, 3, 4;

CREATE OR REPLACE VIEW asset_totals AS 
SELECT author, name, image, category_id, COUNT(1) OVER (PARTITION BY author, category_id, name, image) AS total, 
FROM assets WHERE (author, category_id, name, image) IN (SELECT author, category_id, name, image FROM assets WHERE timestamp > (SELECT * FROM last_timestamp));

CREATE OR REPLACE VIEW asset_burns AS 
WITH last_timestamp AS (SELECT timestamp - INTERVAL '10 minutes' FROM last_updates WHERE type = 'averages'),
burned_assets AS (SELECT asset_id FROM transaction WHERE transaction_type = 6 AND timestamp > (SELECT * FROM last_timestamp)) 
SELECT author, name, image, category_id, COUNT(1) as num_burned
FROM assets WHERE burned AND (author, name, image, category_id) IN (
 SELECT author, name, image, category_id FROM burned_assets 
 LEFT JOIN assets USING(asset_id) 
 GROUP BY 1, 2, 3, 4
) GROUP BY 1, 2, 3, 4;

CREATE OR REPLACE VIEW lowest_market_prices AS 
WITH last_usd AS (
	SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1
) SELECT summary_id, 
min(price) as lowest, 
min(usd_price) as usd_lowest 
FROM sales s INNER JOIN listing_prices_mv USING(sale_id) WHERE NOT bundle AND summary_id IS NOT NULL GROUP BY 1;

INSERT INTO asset_averages (
	SELECT author, name, image, category_id FROM trades WHERE name IS NOT NULL AND image IS NOT NULL AND (
		author NOT IN (SELECT DISTINCT author FROM asset_averages WHERE author = trades.author) 
		OR (author, category_id) NOT IN (SELECT author, category_id FROM asset_averages WHERE author = trades.author AND category_id = trades.category_id) 
		OR (author, name, image, category_id) NOT IN (SELECT author, name, image, category_id FROM asset_averages WHERE author = trades.author AND name = trades.name)
	) GROUP BY 1, 2, 3, 4
);


 verified2 AND c.average IS NOT NULL AND c.average > 0 AND (CASE WHEN currency = 'WAX' THEN CASE WHEN NOT t2.offer_time IS NULL AND t2.offer_time > NOW() AND t2.offer_type IN ('market' , 'ftpack') THEN t2.offer_2 ELSE t2.offer END ELSE t2.offer / (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1) END < c.average) 
 
CREATE MATERIALIZED VIEW listing_prices_mv AS SELECT a1.sale_id,         
CASE WHEN a1.currency = 'WAX' THEN    
	CASE WHEN a1.offer_time IS NOT NULL AND a1.offer_time > now() AND a1.offer_type IN ('market', 'ftpack') THEN a1.offer_2 ELSE a1.offer END      
ELSE a1.offer / ( SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC  LIMIT 1) END AS price, 
up.upliftium, rc.asset_value * (COALESCE(rrm.modifier, 1000) / 1000.0) * COALESCE(rp.factor, 1.0) AS aether_value, 
CASE WHEN a1.currency = 'WAX' THEN 
	CASE WHEN a1.offer_time IS NOT NULL AND a1.offer_time > now() AND a1.offer_type IN ('market', 'ftpack') THEN a1.offer_2 ELSE a1.offer END       
ELSE a1.offer / ( SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1) END * (
	SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1
) AS usd_price,     
CASE WHEN asu.usd_average > 0 THEN CASE WHEN a1.currency = 'WAX' THEN CASE WHEN a1.offer_time IS NOT NULL AND a1.offer_time > now() AND a1.offer_type IN ('market', 'ftpack') 
THEN a1.offer_2 ELSE a1.offer END ELSE a1.offer / ( SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1) END * (
	SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1) / asu.usd_average
ELSE NULL END AS price_diff,           
CASE WHEN rc.asset_value * (COALESCE(rrm.modifier, 1000) / 1000.0) * COALESCE(rp.factor, 1.0) > 0 THEN            
CASE WHEN a1.currency = 'WAX' THEN   
CASE WHEN a1.offer_time IS NOT NULL AND a1.offer_time > now() AND a1.offer_type IN ('market', 'ftpack') THEN a1.offer_2 
ELSE a1.offer END  
ELSE (a1.offer / ( SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1))           
END * ( SELECT usd_prices.usd FROM usd_prices ORDER BY usd_prices."timestamp" DESC LIMIT 1) / (rc.asset_value * (COALESCE(rrm.modifier, 1000) / 1000.0) * COALESCE(rp.factor, 1.0))       
ELSE NULL END AS aether_rate           
FROM sales a1  
LEFT JOIN author_categories ac USING (category_id)          
LEFT JOIN asset_summaries asu USING (summary_id)
LEFT JOIN rplanet_collections rc ON (ac.author = rc.author AND ac.category = rc.category AND CASE 
WHEN rc.rarity_id = 'img' THEN asu.image = rc.rarity      
WHEN rc.rarity_id IN ('rarity', 'Rarity', 'variant', 'level', 'class') THEN ac.category_3 = rc.rarity
WHEN rc.rarity_id = 'name' THEN asu.name = rc.rarity ELSE (
	(ac.author, ac.category, asu.image) NOT IN (SELECT author, category, category_3 FROM rplanet_collections WHERE author = ac.author AND category = ac.category)
	AND (ac.author, ac.category, ac.category_3) NOT IN (SELECT author, category, category_3 FROM rplanet_collections WHERE author = ac.author AND category = ac.category)
	AND (ac.author, ac.category, asu.name) NOT IN (SELECT author, category, category_3 FROM rplanet_collections WHERE author = ac.author AND category = ac.category)
) END)       
LEFT JOIN rplanet_rate_mods rrm ON (a1.template_id = rrm.template_id)  
LEFT JOIN rplanet_pools rp ON (rc.author = rp.author)  
LEFT JOIN upliftium_pool up ON (a1.template_id = up.template_id)       
WHERE (NOT a1.bundle) 
GROUP BY 1, 2, 3, 4, 5, 6;

CREATE MATERIALIZED VIEW listing_prices_mv AS SELECT a1.sale_id,         
         CASE         
    WHEN ((a1.currency_id) = 1) THEN    
CASE  
WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2     
    ELSE a1.offer         
    END      
    ELSE (a1.offer / ( SELECT usd_prices.usd  FROM usd_prices          ORDER BY usd_prices."timestamp" DESC  LIMIT 1))            
    END AS price, up.upliftium,((((rc.asset_value)::numeric * ((COALESCE(rrm.modifier, 1000))::numeric / 1000.0)))::double precision * COALESCE(rp.factor, (1.0)::double precision)) AS aether_value,     (     CASE  
    	WHEN ((a1.currency_id) = 1) THEN          CASE  WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2     
    ELSE a1.offer         
    END       
    ELSE (a1.offer / ( SELECT usd_prices.usd  FROM usd_prices          ORDER BY usd_prices."timestamp" DESC          
 LIMIT 1))  
         END * ( SELECT usd_prices.usd
            FROM usd_prices           
           ORDER BY usd_prices."timestamp" DESC    
          LIMIT 1)) AS usd_price,     
         CASE 
WHEN (asu.usd_average > (0)::double precision) THEN (( 
CASE     
    WHEN ((a1.currency_id) = 1) THEN     
    CASE 
        WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2 
        ELSE a1.offer    
    END  
    ELSE (a1.offer / ( SELECT usd_prices.usd          
       FROM usd_prices   
      ORDER BY usd_prices."timestamp" DESC            
     LIMIT 1))           
END * ( SELECT usd_prices.usd         
   FROM usd_prices       
  ORDER BY usd_prices."timestamp" DESC
 LIMIT 1)) / asu.usd_average)
ELSE NULL::double precision           
         END AS price_diff,           
         CASE 
WHEN (((((rc.asset_value)::numeric * ((COALESCE(rrm.modifier, 1000))::numeric / 1000.0)))::double precision * COALESCE(rp.factor, (1.0)::double precision)) > (0)::double precision) THEN ((           
CASE            
    WHEN ((a1.currency_id) = 1) THEN   
    CASE 
        WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2 
        ELSE a1.offer    
    END  
    ELSE (a1.offer / ( SELECT usd_prices.usd          
       FROM usd_prices   
      ORDER BY usd_prices."timestamp" DESC            
     LIMIT 1))           
END * ( SELECT usd_prices.usd         
   FROM usd_prices       
  ORDER BY usd_prices."timestamp" DESC
 LIMIT 1)) / ((((rc.asset_value)::numeric * ((COALESCE(rrm.modifier, 1000))::numeric / 1000.0)))::double precision * COALESCE(rp.factor, (1.0)::double precision)))       
ELSE NULL::double precision           
         END AS aether_rate           
    FROM ((((((
    listings a1  
    LEFT JOIN author_categories ac USING (category_id)          
    LEFT JOIN asset_summaries asu USING (summary_id)
    LEFT JOIN rplanet_collections rc ON ((((ac.author)::text = (rc.author)::text) AND ((ac.category)::text = (rc.category)::text) AND  CASE 
WHEN ((rc.rarity_id)::text = 'img'::text) THEN ((asu.image)::text = (rc.rarity)::text)      
WHEN ((rc.rarity_id)::text = ANY ((ARRAY['rarity'::character varying, 'Rarity'::character varying, 'variant'::character varying, 'level'::character varying, 'class'::character varying])::text[])) THEN ((ac.category_3)::text = (rc.rarity)::text)
WHEN ((rc.rarity_id)::text = 'name'::text) THEN ((asu.name)::text = (rc.rarity)::text)       ELSE true
         END))       
      LEFT JOIN rplanet_rate_mods rrm ON ((a1.template_id = rrm.template_id))  
      LEFT JOIN rplanet_pools rp ON (((rc.author)::text = (rp.author)::text))  
      LEFT JOIN upliftium_pool up ON ((a1.template_id = up.template_id))       
   WHERE (NOT a1.bundle) 
   GROUP BY a1.sale_id,  
         CASE
    WHEN ((a1.currency_id) = 1) THEN      
CASE     
    WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2     
    ELSE a1.offer        
END      
ELSE (a1.offer / ( SELECT usd_prices.usd 
   FROM usd_prices       
  ORDER BY usd_prices."timestamp" DESC
 LIMIT 1))  
         END, up.upliftium, ((((rc.asset_value)::numeric * ((COALESCE(rrm.modifier, 1000))::numeric / 1000.0)))::double precision * COALESCE(rp.factor, (1.0)::double precision)), (   
         CASE           
    WHEN ((a1.currency_id) = 1) THEN       
CASE     
    WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2     
    ELSE a1.offer            
 END      
ELSE (a1.offer / ( SELECT usd_prices.usd 
   FROM usd_prices       
  ORDER BY usd_prices."timestamp" DESC
 LIMIT 1))  
         END * ( SELECT usd_prices.usd
            FROM usd_prices           
           ORDER BY usd_prices."timestamp" DESC    
          LIMIT 1)),  
         CASE 
WHEN (asu.usd_average > (0)::double precision) THEN (( 
CASE           
    WHEN ((a1.currency_id) = 1) THEN    
    CASE 
        WHEN ((NOT (a1.offer_time IS NULL)) AND (a1.offer_time > now()) AND ((a1.offer_type_id) = ANY (ARRAY[1, 2]))) THEN a1.offer_2 
        ELSE a1.offer    
    END  
    ELSE (a1.offer / ( SELECT usd_prices.usd          
       FROM usd_prices   
      ORDER BY usd_prices."timestamp" DESC            
     LIMIT 1))           
END * ( SELECT usd_prices.usd         
   FROM usd_prices       
  ORDER BY usd_prices."timestamp" DESC  
 LIMIT 1)) / asu.usd_average)
ELSE NULL::double precision           
         END;


CREATE MATERIALIZED VIEW cheapest_mv AS SELECT s.summary_id,          
 s.author_id,               
 s.category_id,             
 min(listing_prices_mv.price) AS min_price
FROM (listings s               
  LEFT JOIN listing_prices_mv USING (sale_id)) 
WHERE ((s.summary_id > 0) AND (NOT s.bundle) AND (s.offer_time IS NULL))
GROUP BY s.summary_id, s.author_id, s.category_id;

CREATE MATERIALIZED VIEW cheapest_mv AS SELECT s.summary_id,          
 s.author_id,               
 s.category_id,             
 min(listing_prices_mv.price) AS min_price
FROM (sales s               
  LEFT JOIN listing_prices_mv USING (sale_id)) 
WHERE ((s.summary_id > 0) AND (NOT s.bundle) AND (s.offer_time IS NULL))
GROUP BY s.summary_id, s.author_id, s.category_id;

INSERT INTO daily_volume_tmp SELECT date, CASE WHEN market = 'myth' THEN 'market.myth' 
ELSE market END AS market, author, SUM(volume) as volume, SUM(usd_volume) as usd_volume 
FROM ((SELECT 
CASE WHEN taker IS NULL THEN market ELSE taker END as market, 
date, author, SUM(volume) * 0.5 as volume, SUM(usd_volume) * 0.5 as usd_volume FROM ( 
SELECT CASE 
WHEN market IN ('gpk.market', 'ws.myth', 'gpk.myth', 'market.myth', 'gpkmarket111') 
THEN 'market.myth' 
WHEN market = 'waxstashsale' THEN 'wax.stash' 
WHEN market = 'waxplorercom' THEN 'nft.hive' 
ELSE market END AS market, CASE WHEN taker = 'waxstashsale' THEN 'wax.stash' WHEN taker = 'waxplorercom' THEN 'nft.hive' ELSE taker END as taker, SUM(price) as volume, SUM(usd_price) as usd_volume, author, 
timestamp::date AS date 
FROM ( 
 SELECT sell_transaction_id, market, taker, price, author, AVG(usd_price) as usd_price, 
 MAX(timestamp) as timestamp 
 FROM trades t GROUP BY 1, 2, 3, 4, 5, bundle 
) AS bundle 
GROUP BY 1, 2, 5, 6 ORDER BY 6 DESC) t GROUP BY 1, 2, 3) UNION (SELECT 
CASE WHEN maker IS NULL THEN market ELSE maker END as market, 
date, author, SUM(volume) * 0.5 as volume, SUM(usd_volume) * 0.5 as usd_volume FROM ( 
SELECT CASE 
WHEN market IN ('gpk.market', 'ws.myth', 'gpk.myth', 'market.myth', 'gpkmarket111') 
THEN 'market.myth' 
WHEN market = 'waxstashsale' THEN 'wax.stash' 
WHEN market = 'waxplorercom' THEN 'nft.hive' 
ELSE market END AS market, CASE WHEN maker = 'waxstashsale' THEN 'wax.stash' WHEN maker = 'waxplorercom' THEN 'nft.hive' ELSE maker END as maker, SUM(price) as volume, SUM(usd_price) as usd_volume, author, 
timestamp::date AS date 
FROM ( 
 SELECT sell_transaction_id, market, maker, price, author, AVG(usd_price) as usd_price, 
   MAX(timestamp) as timestamp 
    FROM trades t GROUP BY 1, 2, 3, 4, 5, bundle 
) AS bundle 
GROUP BY 1, 2, 5, 6 ORDER BY 6 DESC) t GROUP BY 1, 2, 3 
) UNION (
    SELECT
    CASE WHEN market IN ('gpk.market', 'ws.myth', 'gpk.myth', 'market.myth', 'gpkmarket111') THEN 'market.myth' 
    WHEN market = 'alcordexmain' THEN 'alcornftswap' 
    WHEN market = 'waxplorercom' THEN 'nft.hive' 
    WHEN market = 'waxstashsale' THEN 'wax.stash' ELSE market END AS market, timestamp::date as date, author, 
    SUM(price) AS volume, SUM(usd_price) AS usd_volume
    FROM ft_trades ftt LEFT JOIN fts USING(symbol) 
    GROUP BY 1, 2, 3
    ORDER BY 5 DESC
) UNION (
	SELECT market, timestamp::date as date, author, SUM(price) AS volume, SUM(usd_price) AS usd_volume
	FROM drop_trades GROUP BY 1, 2, 3
) UNION (
	SELECT market, timestamp::date as date, author, SUM(price) AS volume, SUM(usd_price) AS usd_volume 
	FROM primary_sales ps LEFT JOIN all_authors USING (author_id) GROUP BY 1, 2, 3
)) t GROUP BY 1, 2, 3;


WITH my_assets AS (
	SELECT *, ROW_NUMBER() OVER (PARTITION BY author, category_id, name, image ORDER BY mint DESC) rn,
	COUNT(*) OVER (PARTITION BY author, category_id, name, image) cnt FROM assets a LEFT JOIN all_authors ac USING (author) 
	WHERE mint IS NOT NULL  AND verified    AND a.owner = 't1.5c.wam'  )
SELECT a.*, c.total, c.num_burned, c.average, c.usd_average, c.lowest, c.num_sales, c.usd_lowest, c.last_sold, c.usd_last_sold, 
cs.image as author_image, t.price, t.usd_price, t.timestamp as sales_date, t.market, f.user_name as favorited, upliftium, 
(rc.asset_value * (COALESCE(rrm.modifier, 1000) / 1000.0) * COALESCE(rp.factor, 1.0)) AS asset_value, 
CASE WHEN s.currency = 'WAX' THEN CASE WHEN NOT s.offer_time IS NULL AND s.offer_time > NOW() 
AND s.offer_type = 'market' THEN s.offer_2 ELSE s.offer END ELSE s.offer / (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1) END as offer, 
s.listing_id, s.market, (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1) AS usd_wax, s.currency, s.bundle, s.seller 
FROM (
	SELECT   a.* FROM my_assets a     WHERE NOT a.burned AND cnt > 1 AND rn = 1     AND a.asset_id NOT IN (SELECT asset_id FROM sales WHERE asset_id = a.asset_id)
	AND verified    AND a.owner = 't1.5c.wam' ORDER BY a.transferred DESC LIMIT 40 OFFSET 0 ) a 
LEFT JOIN asset_summaries c ON (a.author = c.author AND a.name = c.name AND a.image = c.image AND a.category_id = c.category_id) 
LEFT JOIN rplanet_collections rc ON (a.author = rc.author AND a.category = rc.category AND CASE WHEN rarity_id = 'img' THEN a.image = rc.rarity 
	WHEN rarity_id IN ('rarity', 'Rarity', 'variant', 'level', 'class')      THEN a.category_3 = rc.rarity 
	WHEN rarity_id = 'name' THEN a.name = rc.rarity ELSE TRUE END ) 
LEFT JOIN rplanet_rate_mods rrm USING (template_id) LEFT JOIN rplanet_pools rp ON (rc.author = rp.author) 
LEFT JOIN upliftium_pool up ON (a.template_id = up.template_id) LEFT JOIN trades t ON (t.asset_id = a.asset_id 
	AND t.buy_seq = (SELECT MAX(buy_seq) FROM trades WHERE asset_id = a.asset_id))
LEFT JOIN (SELECT name, image, category_id, user_name FROM favorites 
	WHERE user_name = 't1.5c.wam' GROUP BY 1, 2, 3, 4) f ON (a.name = f.name AND a.image = f.image AND a.category_id = f.category_id) 
LEFT JOIN sales s ON (a.asset_id = s.asset_id) LEFT JOIN collections cs ON (cs.collection_name = a.author) WHERE s.asset_id IS NULL  ORDER BY a.transferred DESC;


EXPLAIN ANALYZE WITH usd_rate AS (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1),
search_categories AS (SELECT * FROM author_categories a1 WHERE TRUE AND author = 'stf.capcom' AND category = 'series1'), 
search_author AS (SELECT author_id FROM all_authors WHERE TRUE  AND author = 'stf.capcom' )  
SELECT a1.asset_id, a1.aasset_id, a1.timestamp, ac.verified, a1.owner, a1.template_id, a1.author, a1.name, a1.category, a1.category_2 as variant, 
a1.mdata, a1.category_3 as rarity, a1.color, a1.border, a1.type, a1.attr7, a1.attr8, a1.attr9, a1.attr10, a1.mint, a1.standard, a1.number, 
a1.image, a1.backimg, asu.total, asu.num_burned, asu.average, asu.usd_average, asu.last_sold, asu.usd_last_sold, asu.lowest, asu.usd_lowest, 
asu.revenue, asu.usd_revenue, asu.num_sales , staker, col.image as author_image, user_name as favorited, 
COALESCE(ft.unpack_url, nft.unpack_url) AS unpack_url, ft.contract, ft.symbol, up.upliftium, 
(asset_value * (COALESCE(modifier, 1000)/1000.0) * COALESCE(rp.factor, 1.0)) as aether_value 
FROM rplanet_stakes rs 
INNER JOIN assets a1 USING(asset_id)  
INNER JOIN search_categories ac ON (ac.category_id = a1.category_id) 
LEFT JOIN asset_summaries asu USING (summary_id) 
LEFT JOIN favorites f ON (f.asset_id = a1.asset_id AND user_name = 't1.5c.wam') 
LEFT JOIN collections col ON (col.author_id = a1.author_id) 
LEFT JOIN rplanet_collections rc ON (
	a1.author = rc.author AND ac.category = rc.category 
	AND CASE WHEN rarity_id = 'img' THEN a1.image = rc.rarity      
	WHEN rarity_id IN ('rarity', 'Rarity', 'variant', 'level', 'class') THEN ac.category_3 = rc.rarity
	WHEN rarity_id = 'name' THEN a1.name = rc.rarity ELSE TRUE END
) LEFT JOIN rplanet_rate_mods rrm ON (a1.template_id = rrm.template_id) 
LEFT JOIN rplanet_pools rp ON (rc.author = rp.author) 
LEFT JOIN upliftium_pool up ON (a1.template_id = up.template_id) 
LEFT JOIN fts ft ON (ft.symbol = a1.name AND ft.author = a1.author) 
LEFT JOIN nft_packs nft ON (a1.summary_id = nft.summary_id) 
WHERE TRUE  AND staker = 't1.5c.wam' AND ac.verified  AND a1.author_id = (SELECT * FROM search_author)   
ORDER BY a1.timestamp DESC LIMIT 40 OFFSET 0;

EXPLAIN ANALYZE WITH usd_rate AS (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1), 
search_categories AS (SELECT * FROM author_categories a1 
WHERE TRUE  AND author = 'stf.capcom' AND category = 'series1'), 
search_author AS (SELECT author_id FROM all_authors WHERE TRUE  AND author = 'stf.capcom' )  
SELECT COUNT(1) as total_results, SUM(asu.average) as average, SUM(asu.usd_average) as usd_average 
FROM rplanet_stakes rs 
INNER JOIN assets a1 USING(asset_id)  
INNER JOIN author_categories ac ON (ac.category_id = a1.category_id)  
LEFT JOIN asset_summaries asu USING (summary_id) 
WHERE TRUE  AND ac.verified  AND a1.author_id = (SELECT * FROM search_author)     
AND staker IS NOT NULL  AND staker = 't1.5c.wam';

CREATE MATERIALIZED VIEW user_assets_mv AS 
SELECT CASE WHEN seller IS NOT NULL then seller 
WHEN tuber IS NOT NULL THEN tuber 
WHEN staker IS NOT NULL THEN staker ELSE owner END as owner, 
a.author, a.name, a.image, a.category_id, COUNT(1) as count, MIN(a.mint) as mint, COUNT(1) FILTER (
WHERE tuber IS NULL) as untubed, collection_item_id 
FROM assets a LEFT JOIN sales s USING (asset_id) 
LEFT JOIN rplanet_stakes rs USING(asset_id) 
LEFT JOIN kogs_tubes kt USING (asset_id) 
INNER JOIN collection_items ci ON (
ci.author = a.author AND ci.name = a.name 
AND ci.image = a.image AND ci.category_id = a.category_id) 
WHERE (a.author, a.category) IN (
SELECT author, category FROM collection_categories)
AND (tuber IS NOT NULL OR seller IS NOT NULL OR seller IS NOT NULL OR NOT burned) 
GROUP BY 1, 2, 3, 4, 5, 9;

SELECT * FROM sales a1
LEFT JOIN author_categories ac USING (category_id)          
    LEFT JOIN asset_summaries asu USING (summary_id)
    LEFT JOIN rplanet_collections rc ON ((((ac.author)::text = (rc.author)::text) AND ((ac.category)::text = (rc.category)::text) AND  CASE 
WHEN ((rc.rarity_id)::text = 'img'::text) THEN ((asu.image)::text = (rc.rarity)::text)      
WHEN ((rc.rarity_id)::text = ANY ((ARRAY['rarity'::character varying, 'Rarity'::character varying, 'variant'::character varying, 'level'::character varying, 'class'::character varying])::text[])) THEN ((ac.category_3)::text = (rc.rarity)::text)
WHEN ((rc.rarity_id)::text = 'name'::text) THEN ((asu.name)::text = (rc.rarity)::text)       ELSE true
         END))       
      LEFT JOIN rplanet_rate_mods rrm ON ((a1.template_id = rrm.template_id))  
      LEFT JOIN rplanet_pools rp ON (((rc.author)::text = (rp.author)::text))  
      LEFT JOIN upliftium_pool up ON ((a1.template_id = up.template_id))
WHERE sale_id = 16915065;


WITH usd_rate AS (SELECT usd FROM usd_prices ORDER BY timestamp DESC LIMIT 1)  
SELECT a2.transaction_id,CASE WHEN a2.currency = 'WAX' THEN CASE WHEN NOT a2.offer_time IS NULL AND a2.offer_time > NOW() 
AND a2.offer_type = 'market' THEN a2.offer_2 ELSE a2.offer END ELSE a2.offer / (SELECT * FROM usd_rate) END as offer, 
(SELECT * FROM usd_rate) AS usd_wax, a2.offer_2, a2.offer_type, a2.bundle, a2.listing_id, a2.seller, a2.market, a2.timestamp, a1.verified, 
json_agg(json_build_object(    'asset_id', a.asset_id, 'aasset_id', a.aasset_id, 'name', a.name, 'standard', a.standard,     
'image', a.image, 'backimg', a.backimg, 'category', a.category, 'variant', a.category_2,    
'rarity', a.category_3, 'color', a.color, 'border', a.border, 'type', a.type,     'attr7', a.attr7, 'attr8', a.attr8, 'attr9', a.attr9, 'attr10', a.attr10,
'author', a.author, 'owner', a.owner, 'number', a.number,     'mint', a.mint, 'total', c.total, 'num_burned', c.num_burned,
'average', c.average, 'num_sales', c.num_sales,     'usd_average', c.usd_average, 'lowest', c.lowest, 'usd_lowest', c.usd_lowest,
'last_sold', c.last_sold, 'usd_last_sold', c.usd_last_sold, 'templateId', a.template_id, 
'favorited', f.user_name, 'verified', a1.verified, 'author_image', cs.image, 
'aether_value', (rc.asset_value * (    COALESCE(rrm.modifier, 1000) / 1000.0) * COALESCE(rp.factor, 1.0)),     'upliftium', upliftium)) as assets FROM
(SELECT listing_id, market, a1.verified2 AS verified, a1.currency, a1.offer_time, a1.offer_2, a1.offer_type, a1.offer, lp.price 
FROM sales a1 LEFT JOIN listing_prices_mv lp USING(sale_id) LEFT JOIN author_categories ac ON (a1.category_id = ac.category_id) WHERE a1.bundle  
AND a1.author_id = 147 AND ac.verified   AND a1.bundle  AND a1.offer_type IN ('market', 'ftpack')  
AND (CASE WHEN a1.currency = 'WAX' THEN CASE WHEN NOT a1.offer_time IS NULL AND a1.offer_time > NOW() 
	AND a1.offer_type = 'market' THEN a1.offer_2 ELSE a1.offer END ELSE a1.offer / (SELECT * FROM usd_rate) END) <= 100.0  
GROUP BY 1, 2, 3, a1.offer, a1.timestamp, a1.currency, a1.offer_time, a1.offer_2, a1.offer_type, lp.price ORDER BY a1.price ASC LIMIT 40 OFFSET 0) a1 
LEFT JOIN sales a2 USING(market, listing_id) INNER JOIN assets a using(asset_id) LEFT JOIN asset_summaries c ON (a.summary_id = c.summary_id) 
LEFT JOIN (SELECT name, image, category_id, user_name FROM favorites WHERE user_name = '' GROUP BY 1, 2, 3, 4) f ON 
(a.name = f.name AND a.image = f.image AND a.category_id = f.category_id) LEFT JOIN collections cs ON (a.author_id = cs.author_id) 
LEFT JOIN rplanet_collections rc ON (a.author = rc.author AND a.category = rc.category AND CASE WHEN rarity_id = 'img' THEN a.image = rc.rarity      
	WHEN rarity_id IN ('rarity', 'Rarity', 'variant', 'level', 'class')      THEN a.category_3 = rc.rarity      
	WHEN rarity_id = 'name' THEN a.name = rc.rarity ELSE TRUE END ) LEFT JOIN rplanet_rate_mods rrm ON (rrm.template_id = a.template_id) 
LEFT JOIN rplanet_pools rp ON (rc.author = rp.author) LEFT JOIN upliftium_pool up ON (a.template_id = up.template_id)
 LEFT JOIN nft_packs nft ON (a.summary_id = nft.summary_id) 
 GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, a2.offer, a2.currency, a2.offer_time, a2.offer_2, a2.offer_type, a1.price  ORDER BY a2.price ASC 

('3rdedition', False, 'common', 'KOG', 'Rainbow', 17280795672),
('3rdedition', False, 'common', 'Slammer', 'Rainbow', 17280796696),
('3rdedition', False, 'common', '', Superset', 8690863186),
('3rdedition', True, 'common', 'KOG', 'Rainbow', 17280861208),
('3rdedition', True, 'common', 'Slammer', 'Rainbow', 17280862232),
('3rdedition', True, 'common', '', 'Superset', 8690928722),
('3rdedition', True, 'rare', 'Gold Slammer', 'Rainbow', 17281652792),
('3rdedition', True, 'rare', 'KOG', 'Rainbow', 17281647672),
('3rdedition', True, 'rare', '', 'Royal Superset', 8691719210),
('3rdedition', True, 'rare', 'Slammer', 'Rainbow', 17281648696),
('3rdedition', True, 'rare', '', 'Superset', 8691715109),
('3rdedition', True, 'ultra rare', 'Gold Slammer', 'Rainbow', 17282701332),
('3rdedition', True, 'ultra rare', 'KOG', 'Rainbow', 17282696212),
('3rdedition', True, 'ultra rare', '', 'Royal Superset', 8692767773),
('3rdedition', True, 'ultra rare', 'Slammer', 'Rainbow', 17282697236),
('3rdedition', True, 'ultra rare', '', 'Superset', 8692763673),
('3rdedition', True, 'uncommon', 'KOG', 'Rainbow', 17281123360),
('3rdedition', True, 'uncommon', 'Slammer', 'Rainbow', 17281124384),
('3rdedition', True, 'uncommon', '', 'Superset', 8691190840),
('3rdedition', False, 'rare', 'Gold Slammer', 'Rainbow', 17281587256),
('3rdedition', False, 'rare', 'KOG', 'Rainbow', 17281582136),
('3rdedition', False, 'rare', 'Royal Superset', 8691653674),
('3rdedition', False, 'rare', 'Slammer', 'Rainbow', 17281583160),
('3rdedition', False, 'rare', '', 'Superset', 8691649573),
('3rdedition', False, 'ultra rare', 'Gold Slammer', 'Rainbow', 17282635796),
('3rdedition', False, 'ultra rare', 'KOG', 'Rainbow', 17282630676),
('3rdedition', False, 'ultra rare', '', 'Royal Superset', 8692702237),
('3rdedition', False, 'ultra rare', 'Slammer', 'Rainbow', 17282631700),
('3rdedition', False, 'ultra rare', '', 'Superset', 8692698137),
('3rdedition', False, 'uncommon', 'KOG Rainbow', 17281057824),
('3rdedition', False, 'uncommon', 'Slammer Rainbow', 17281058848),
('3rdedition', False, 'uncommon', '', 'Superset', 8691125304)




WITH image_ids AS (SELECT image, author, set_id, ROW_NUMBER() OVER (PARTITION BY set_id ORDER BY number ASC, name ASC) AS row_num FROM collection_items ci INNER JOIN set_mapping sm USING (collection_item_id)) SELECT array_agg(image), set_id FROM image_ids WHERE row_num <= 4 AND author = 'kogsofficial' GROUP BY 2 ORDER BY set_id DESC;

UPDATE ranking_full r SET distinct_asset_count = asset_count, distinct_untubed_count = untubed, set_count = q.set_count FROM (    SELECT a.author, owner, css.set_id,     MIN(count) AS set_count,     COUNT(DISTINCT(a.owner, a.name, a.image, a.category_id)) as asset_count,     COUNT(DISTINCT(a.owner, a.name, a.image, a.category_id)) FILTER (WHERE untubed > 0) as untubed     FROM user_assets a     INNER JOIN set_mapping sm USING(collection_item_id)     INNER JOIN collection_set_scores_new css USING (set_id)     WHERE a.author = 'alien.worlds' AND css.collection_name = 'common'     GROUP BY 1, 2, 3 ) q WHERE q.owner NOT IN (SELECT * FROM markets) AND q.owner NOT IN (SELECT * FROM team_accounts) AND r.author = 'alien.worlds' AND user_name = q.owner AND r.author = q.author AND r.set_id = q.set_id