package com.osmdroid;

import android.content.Context;
import androidx.annotation.NonNull;
import android.util.Log;

import org.osmdroid.tileprovider.modules.ArchiveFileFactory;
import org.osmdroid.tileprovider.modules.IArchiveFile;
import org.osmdroid.tileprovider.modules.OfflineTileProvider;
import org.osmdroid.tileprovider.tilesource.FileBasedTileSource;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.tileprovider.util.SimpleRegisterReceiver;
import org.osmdroid.views.MapView;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Allows to use offline tile source
 *
 * - Put zip file(s) in internal memory: /data/data/{packageName}/files/offline_tiles/
 * - Internal file subdirectory (offline_tiles) may be changed with setFileDirPath or fileDirPath in
 * js.
 * - Every zip must have same root directory, with same name as others: {ROOT_DIR_NAME}/z/X/Y
 * - Remember to remove hidden os related garbage (like .DS_Store etc.) before creating zip
 * - Zip files may have any name
 */
public class OsmMapFileTile extends OsmMapFeature {

  private final static String TAG = "OsmMapFileTile";

  private float maximumZ = 100.f;
  private float minimumZ = 0;
  private String fileDirPath = "/offline_tiles/";

  public OsmMapFileTile(Context context) {
    super(context);
  }

  @Override public void addToMap(MapView map) {
    setupMapProvider(map);
    map.setUseDataConnection(false);
    // map.setTilesScaledToDpi(false);
  }

  @Override public void removeFromMap(MapView map) {
    map.setTileSource(TileSourceFactory.DEFAULT_TILE_SOURCE);
    // map.setTilesScaledToDpi(false);
  }

  @Override public Object getFeature() {
    return null;
  }

  public void setMaximumZ(float maximumZ) {
    this.maximumZ = maximumZ;
  }

  public void setMinimumZ(float minimumZ) {
    this.minimumZ = minimumZ;
  }

  public void setFileDirPath(String filePath) {
    this.fileDirPath = filePath;
  }

  @NonNull
  private File[] findAllSupportedFilesInDirectory(File directory) {
    List<File> candidates = new ArrayList<>();
    File[] list = directory.listFiles();
    for (int i = 0; i < list.length; i++) {
      if (list[i].isDirectory()) {
        continue;
      }
      String name = list[i].getName().toLowerCase();
      if (!name.contains(".")) {
        continue; //skip files without an extension
      }
      name = name.substring(name.lastIndexOf(".") + 1);
      if (name.length() == 0) {
        continue;
      }
      if (ArchiveFileFactory.isFileExtensionRegistered(name)) {
        candidates.add(list[i]);
      }
    }
    return candidates.toArray(new File[0]);
  }

  private void setupMapProvider(@NonNull MapView map) {
    //first we'll look at the default location for tiles that we support
    Context context = map.getContext();
    File f = new File(context.getFilesDir() + fileDirPath);
    if (f.exists() && f.isDirectory()) {

      File[] list = findAllSupportedFilesInDirectory(f);
      if (list.length > 0) {
        try {
          OfflineTileProvider tileProvider =
              new OfflineTileProvider(new SimpleRegisterReceiver(map.getContext()), list);
          map.setTileProvider(tileProvider);
          // setup tile source
          String source = "";
          IArchiveFile[] archives = tileProvider.getArchives();
          if (archives.length > 0) {
            //cheating a bit here, get the first archive file and ask for the tile sources
            // names it contains
            Set<String> tileSources = archives[0].getTileSources();
            //presumably, this would be a great place to tell your users which tiles sources
            // are available
            if (!tileSources.isEmpty()) {
              //ok good, we found at least one tile source, create a basic file based tile
              // source using that name
              //and set it. If we don't set it, osmdroid will attempt to use the default
              // source, which is "MAPNIK",
              //which probably won't match your offline tile source, unless it's MAPNIK
              source = tileSources.iterator().next();
              map.setTileSource(FileBasedTileSource.getSource(source));
            } else {
              map.setTileSource(TileSourceFactory.DEFAULT_TILE_SOURCE);
            }

          } else {
            map.setTileSource(TileSourceFactory.DEFAULT_TILE_SOURCE);
          }
          Log.d(TAG, "Using " + source);
          map.invalidate();
          return;
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      } else {
        Log.d(TAG, f.getAbsolutePath() + " dir not found!");
      }
    }
  }
}
