using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

public class MazeGenerator : MonoBehaviour
{
    public TMPro.TMP_InputField gridSizeInput;
    public TMPro.TMP_Text roundText;
    public GameObject blackCellPrefab;
    public GameObject whiteCellPrefab;
    public List<GameObject> cells;

    private int gridSize = 1;
    private int currentRound = 0;

    private CellSettings cellSettings;

    public void GenerateMaze()
    {
        // Clear existing grid
        ClearGrid();
        gridSize = int.Parse(gridSizeInput.text);
        float cellSize = 1.0f;

        float offsetX = -0.5f * gridSize * cellSize;
        float offsetY = -0.5f * gridSize * cellSize;

        int cellIndex = 1;

        for (int j = 0; j < gridSize; j++)
        {
            for (int i = 0; i < gridSize; i++)
            {
                GameObject cell;

                if (Random.Range(0, 2) == 0)
                {
                    cell = Instantiate(blackCellPrefab);
                }
                else
                {
                    cell = Instantiate(whiteCellPrefab);
                }

                cell.transform.parent = transform;
                cell.transform.position = new Vector3(i * cellSize + offsetX, j * cellSize + offsetY, 0);

                cellSettings = cell.GetComponent<CellSettings>();
                cellSettings.SetIndex(cellIndex);

                cells.Add(cell);

                cellIndex++;
            }
        }
    }

    private void ClearGrid()
    {
        ClearRound();
        cells.Clear();
        // Destroy all child objects (existing grid)
        foreach (Transform child in transform)
        {
            Destroy(child.gameObject);
        }
    }

    public void NextRound()
    {
        currentRound++;
        roundText.text = currentRound.ToString();

        Debug.Log(currentRound);
        Debug.Log("is odd size" + gridSize % 2);
        UpdateCellIndex();
    }

    public void ClearRound()
    {
        currentRound = 0;
        roundText.text = currentRound.ToString();

        foreach (GameObject cell in cells)
        {
            cellSettings = cell.GetComponent<CellSettings>();
            cellSettings.IsNotCurrentRound();
        }
    }

    public void UpdateCellIndex()
    {
        foreach (GameObject cell in cells)
        {
            cellSettings = cell.GetComponent<CellSettings>();

            bool isHighlightedLine = false;
            int index = int.Parse(cellSettings.indexText.text);
            bool isOddSize = gridSize % 2 == 1;
            int currentRow = (index - 1) / gridSize + 1;

            // odd round, odd lines
            if ((currentRound % 2 == 1 && currentRow % 2 == 1)
                // even round, even lines
                || (currentRound % 2 == 0 && currentRow % 2 == 0))
            {
                isHighlightedLine = true;
            }
            else
            {
                isHighlightedLine = false;
            }

            if (isHighlightedLine)
            {
                cellSettings.IsCurrentRound();
                Debug.Log("Cell highlighted: " + cellSettings.indexText.text);
            }
            else
            {
                cellSettings.IsNotCurrentRound();
                Debug.Log("Cell normal: " + cellSettings.indexText.text);
            }
        }
    }

}
