<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];

    // TODO: search database for places matching $_GET["geo"]

    // ensure proper usage
    if (empty($_GET["geo"]))
    {
        http_response_code(400);
        exit;
    }

    // escape user's input
    $geo = $_GET["geo"];
    
    
    if(is_numeric($geo))
    {
	$places = query("SELECT * FROM places WHERE postal_code = ?", $geo);
    }

    else
    {
	preg_match_all('/[^,|^\s]+/', $geo, $matches);	

	if(count($matches[0]) == 1)
	{
	    $places = query("SELECT * FROM places WHERE MATCH (country_code, postal_code, place_name, 
     admin_name1, admin_code1) AGAINST ('+" . $matches[0][0] . "*' IN BOOLEAN MODE)");	    
	}
	else if(count($matches[0]) == 2)
	{
	    $places = query("SELECT * FROM places WHERE MATCH (country_code, postal_code, place_name, 
     admin_name1, admin_code1) AGAINST ('+" . $matches[0][0] . "* +" . $matches[0][1] . "*' IN BOOLEAN MODE)");	    
	}
	else if(count($matches[0]) == 3)
	{
	    $places = query("SELECT * FROM places WHERE MATCH (country_code, postal_code, place_name, 
     admin_name1, admin_code1) AGAINST 
	('+" . $matches[0][0] . "* +" . $matches[0][1] . "* +" . $matches[0][2] . "*' IN BOOLEAN MODE)");	    
	}
	else if(count($matches[0]) == 4)
	{
	    $places = query("SELECT * FROM places WHERE MATCH (country_code, postal_code, place_name, 
     		admin_name1, admin_code1) AGAINST 
			('+" . $matches[0][0] . "* +" . $matches[0][1] . "* +" . $matches[0][2] . "* 
				+" . $matches[0][3] . "*' IN BOOLEAN MODE)");	    
	}
	else if(count($matches[0]) == 5)
	{
	    $places = query("SELECT * FROM places WHERE MATCH (country_code, postal_code, place_name, 
     		admin_name1, admin_code1) AGAINST 
			('+" . $matches[0][0] . "* +" . $matches[0][1] . "* +" . $matches[0][2] . "* 
				+" . $matches[0][3] . "* +" . $matches[0][4] . "*' IN BOOLEAN MODE)");	    
	}
    }

    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>
