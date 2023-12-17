using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class CellSettings : MonoBehaviour
{
    public TMP_Text indexText;

    public bool isCurrentRound = false;

    public bool isYin = false;

    public bool isLocked = false;

    public bool isShowed = false;

    private MazeGenerator mazeGenerator;

    // Start is called before the first frame update
    void Start()
    {
        mazeGenerator = GameObject.FindGameObjectWithTag("GameController").GetComponent<MazeGenerator>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetIndex(int input)
    {
        indexText.text = input.ToString();
    }

    public int GetIndex()
    {
        return int.Parse(indexText.text);
    }

    public void IsCurrentRound()
    {
        isCurrentRound = true;
        if (isLocked) return;

        indexText.fontStyle = FontStyles.Underline;
    }

    public void IsNotCurrentRound()
    {
        isCurrentRound = false;
        if (isLocked) return;

        indexText.fontStyle = FontStyles.Normal;
    }

    public int GetYinYangCode()
    {
        if (isYin)
        {
            return 0;
        }
        else
        {
            return 1;
        }
    }

    public void SwitchYinYang()
    {
        // yin to yang
        if (isYin) 
        {
            isYin = false;
            GetComponent<SpriteRenderer>().color = Color.white;
        }
        // yang to yin
        else
        {
            isYin = true;
            GetComponent<SpriteRenderer>().color = Color.black;
        }
    }

    public void OnCellClick()
    {
        if (!isLocked)
        {
            isLocked = true;
            indexText.fontStyle = FontStyles.Strikethrough | FontStyles.Italic;
            Debug.Log("lock cell " + indexText.text);
            mazeGenerator.clickedCells.Add(gameObject);
            mazeGenerator.clickedCellsCode.Add(GetYinYangCode());

            mazeGenerator.ShowClickedCells();

            GetComponent<SpriteRenderer>().color = Color.yellow;

        }
        else
        {
            Debug.Log("cell already locked " + indexText.text);
        }
    }

    public void DestroySelf()
    {
        Destroy(gameObject);
    }
}
