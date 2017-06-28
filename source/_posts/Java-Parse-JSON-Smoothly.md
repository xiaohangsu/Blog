---
title: Java Parse JSON Smoothly
date: 2017-06-27 20:44:43
tags:
---


## Java Parse JSON Smoothly
Currently I am working on [Boss Money](https://www.bossrevolution.com/en-us/services/money-transfer) Android widget part. There is a case that we need to parse JSON from GraphQL backend. It is pretty easy in Javascript. For example, there is a JSON like:
<pre>
<code class="json">{"data":
	{"fxRates": [
			{"rate":"12.33","fee":"1.00"},
			{"rate":"12.33","fee":"2.00"}
		]
    }
}
</code>
</pre>

In Javascript script if you want to get fxRates first element rate, it just pretty natural: 
<pre>
<code class="js">json.data.fxRates[0].rate
</code>
</pre>

But when it came to Java, it is really verbose:
<pre>
<code class="java">JSONTokener jsonTokener = new JSONTokener(sb.toString());
JSONObject jsonObject = (JSONObject) jsonTokener.nextValue();
JSONObject jsonObject1 = (JSONObject) jsonObject.get("data");
JSONArray jsonArray =  jsonObject1.getJSONArray("fxRates");
JSONObject jsonObject3 = (JSONObject) jsonArray.get(0);
String rate = jsonObject3.getString("rate");
</code>
</pre>

It just like a onion you need to peel down to get what you want. And the down side for this is lacking of ability to **deal with exception**. For example: if here `jsonArray` is a null array get will throw a error. And codes like this only apply to fix structure of json, it would fail once backend change response JSON structure.

So what I am doing is to create a helper class dealing with plain json string, with great flexibility to support JSON structure and writability for developers. Those are code snippet from `JSONHelper.java`.
<pre>
<code class="java">    public void parseJSON(String rawJSONString) {
	    try {
	        JSONObject jsonObject = new JSONObject(rawJSONString);
	        parseJSON(jsonObject, "");
	    } catch (JSONException e) {
	        e.printStackTrace();
	    }
	}

    public void parseJSON(JSONObject jsonObject, String preKey) {
        try {
            Iterator<String> keys = jsonObject.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object obj = jsonObject.get(key);
                if (obj instanceof JSONObject) {
                    parseJSON((JSONObject) obj, preKey.equals("") ? key : preKey + "." + key);
                } else if (obj instanceof JSONArray) {
                    parseJSONArray((JSONArray) obj, preKey.equals("") ? key : preKey + "." + key);
                } else {
                    if (preKey.equals("")) {
                        hashMap.put(key, obj);
                    } else {
                        hashMap.put(preKey + "." + key, obj);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
</code>
</pre>

`parseJSON(String)` as an entrence of parsing process. First I should `JSONObject` API should be familiar, [`JSONObject.keys()`](https://developer.android.com/reference/org/json/JSONObject.html#keys(%29). The tricky things here are HashMap and recursion. Still it is like peeling onion but I extract more and generalize it. **PreKey** here means the outer *"wrapper"*(**outer key**) name. We can concatenate it for hashMap key field eventually.

For each Key-Value in JSON, there will be three cases:
1. Value is JSONObject, recursive call parseJSON(jsonObject, preKey), passing `preKey + currentKey` as next func parseJSON's key.
2. Value is Object. put it into hashMap and save it.
3. Last is JSONArray, I write another method for doing that:


<pre>
<code class="java">    public void parseJSONArray(JSONArray jsonArray, String preKey) {
		try {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);
				parseJSON(jsonObject, preKey + "[" + String.valueOf(i) + "]");
			}
		} catch(JSONException e) }
			e.printStackTrace();
		}
	}
</code>
</pre>
In here every element of `JSONArray` is `JSONObject`, so we just reuse (*recursive call*) `parseJSON` again.

So I can get the rate with this class easily:
<pre>
<code class="java">JSONHelper jsonHelper = new JSONHelper(rawStr);
jsonHelper.getString("data.fxRates.rate[0]", "Default"); // "12.33"
</code>
</pre>
Even JSON change structure and with different nested fields, I still can value easily using this.

Source Code:
<pre><code class="java">import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Iterator;

public class JSONHelper extends Object {
    private HashMap<String, Object> hashMap;

    public JSONHelper() {
        hashMap = new HashMap<>();
    }

    public  JSONHelper(String rawJSONString) {
        hashMap = new HashMap<>();
        parseJSON(rawJSONString);
    }

    public JSONHelper(JSONObject jsonObject) {
        hashMap = new HashMap<>();
        parseJSON(jsonObject);
    }

    public void parseJSON(String rawJSONString) {
        try {
            JSONObject jsonObject = new JSONObject(rawJSONString);
            parseJSON(jsonObject, "");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void parseJSON(JSONObject jsonObject) {
        parseJSON(jsonObject, "");
    }

    public void parseJSON(JSONObject jsonObject, String preKey) {
        try {
            Iterator<String> keys = jsonObject.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object obj = jsonObject.get(key);
                if (obj instanceof JSONObject) {
                    parseJSON((JSONObject) obj, preKey.equals("") ? key : preKey + "." + key);
                } else if (obj instanceof JSONArray) {
                    parseJSONArray((JSONArray) obj, preKey.equals("") ? key : preKey + "." + key);
                } else {
                    if (preKey.equals("")) {
                        hashMap.put(key, obj);
                    } else {
                        hashMap.put(preKey + "." + key, obj);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void parseJSONArray(JSONArray jsonArray, String preKey) {
        try {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                parseJSON(jsonObject, preKey + "[" + String.valueOf(i) + "]");
            }
        } catch(JSONException e) {
            e.printStackTrace();
        }
    }

    public Object getObject(String key) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getObject", "Not Such Key: " + key);
        }
        return hashMap.get(key);
    }

    public Boolean hasKey(String key) {
        return hashMap.get(key) != null;
    }

    public Integer getInt(String key, int defaultInt) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getInt", "Not Such Key: " + key);
            return defaultInt;
        }
        if (hashMap.get(key) instanceof  Integer)
            return (Integer) hashMap.get(key);
        else {
            Log.e("JSONHelper.getInt", "Type do not matched");
            return defaultInt;
        }
    }


    public String getString(String key, String defaultString) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getString", "Not Such Key: " + key);
            return defaultString;
        }
        if (hashMap.get(key) instanceof String)
            return (String) hashMap.get(key);
        else {
            Log.e("JSONHelper.getString", "Type do not matched");
            return defaultString;
        }
    }

    public Double getDouble(String key, Double defaultDouble) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getDouble", "Not Such Key: " + key);
            return defaultDouble;
        }
        if (hashMap.get(key) instanceof Double)
            return (Double) hashMap.get(key);
        else {
            Log.e("JSONHelper.getDouble", "Type do not matched");
            return defaultDouble;
        }
    }

    public Long getLong(String key, Long defaultLong) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getLong", "Not Such Key: " + key);
            return defaultLong;
        }

        if (hashMap.get(key) instanceof Long)
            return (Long) hashMap.get(key);
        else {
            Log.e("JSONHelper.getLong", "Type do not matched");
            return defaultLong;
        }
    }

    public Boolean getBoolean(String key, Boolean defaultBoolean) {
        if (!hasKey(key)) {
            Log.e("JSONHelper.getBoolean", "Not Such Key: " + key);
            return defaultBoolean;
        }

        if (hashMap.get(key) instanceof Boolean)
            return (Boolean) hashMap.get(key);
        else {
            Log.e("JSONHelper.getBoolean", "Type do not matched");
        }
        return defaultBoolean;
    }

    public String toString() {
        return hashMap.toString();
    }

    public void setObject(String key, Object obj) {
        hashMap.put(key, obj);
    }
}
</code></pre>